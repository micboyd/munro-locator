import { Component, OnInit } from '@angular/core';
import { combineLatest, debounceTime } from 'rxjs';

import { FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Munro } from '../../shared/models/Munro';
import { MunroService } from '../../shared/services/munros.service';
import { UserService } from '../../shared/services/user.service';
import { environment } from '../../../environments/environment';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-mountain-manager',
	templateUrl: './mountain-manager.component.html',
	standalone: false,
})
export class MountainManagerComponent implements OnInit {

      private _apiUrl = `${environment.baseApiUrl}/munros`;

	constructor(private munroService: MunroService, private userService: UserService, private http: HttpClient) {}

	get displayMunros(): Array<Munro> {
		const baseList = (() => {
			switch (this.activeTab) {
				case 1:
					return this._completedMunros;
				case 2:
					return this._uncompletedMunros;
				default:
					return this._allMunros;
			}
		})();

		if (!this.searchQuery) return baseList;

		return baseList.filter(
			m =>
				m.hill_name?.toLowerCase().includes(this.searchQuery) ||
				m.region_name?.toLowerCase().includes(this.searchQuery),
		);
	}

	get allMunros(): Array<Munro> {
		return this._allMunros;
	}

	get completedMunros(): Array<Munro> {
		return this._completedMunros;
	}

	get uncompletedMunros(): Array<Munro> {
		return this._uncompletedMunros;
	}

	munrosLoading: boolean = false;
	activeTab = 0;

	private _allMunros: Array<Munro> = [];
	private _completedMunros: Array<Munro> = [];
	private _uncompletedMunros: Array<Munro> = [];

	faSearch = faSearch;
	searchControl = new FormControl(''); // ← reactive form control for search
	searchQuery: string = '';

	tabs = [];

	ngOnInit() {
		this.munrosLoading = true;

		this.getAllMunrosAndSync();
	}

	getAllMunrosAndSync() {
		this.searchControl.valueChanges
			.pipe(debounceTime(300)) // optional debounce
			.subscribe(value => {
				this.searchQuery = value?.trim().toLowerCase() || '';
				this.updateTabs(); // ← recalculate filtered counts
			});

		combineLatest([
			this.munroService.getMunros(),
			this.munroService.getUserCompletedMunros(this.userService.userId),
		]).subscribe(([allMunros, completedMunroIds]) => {
			const completedIds = Array.isArray(completedMunroIds) ? completedMunroIds : [];

			this._allMunros = allMunros.map((munroData: Munro) => {
				const munro = new Munro(munroData);
				if (completedIds.includes(munro._id)) {
					munro.completed = true;
				}
				return munro;
			});

			this.syncMunroLists();
			this.updateTabs();
			this.munrosLoading = false;
		});
	}

	updateTabs() {
		const query = this.searchQuery?.toLowerCase() || '';

		const filterFn = (munro: Munro) =>
			!query ||
			munro.hill_name?.toLowerCase().includes(query) ||
			munro.region_name?.toLowerCase().includes(query);

		this.tabs = [
			{
				label: 'All',
				count: () => this._allMunros.filter(filterFn).length,
			},
			{
				label: 'Complete',
				count: () => this._completedMunros.filter(filterFn).length,
			},
			{
				label: 'Incomplete',
				count: () => this._uncompletedMunros.filter(filterFn).length,
			},
		];
	}
	munroCompletedUpdated(munro: Munro, completed: boolean) {
		this.munroService.updateCompletedMunros();
		munro.completed = completed;

		this.syncMunroLists();
		this._allMunros = [...this._allMunros];
		this.updatedUserCompleted();
	}

	updatedUserCompleted() {
		this.munroService
			.updatedUserCompletedMunros(
				this.userService.userId,
				this._completedMunros.map(item => item._id),
			)
			.subscribe();
	}

	onImageSelect(event: any, munro: Munro) {
		const file = event.target.files[0];

		if (file) {
			const formData = new FormData();
			formData.append('image', file, file.name);

			// Send the form data (with the image file) to your API to upload the image
			this.http.post(`${this._apiUrl}/${munro._id}/image`, formData).subscribe(
				response => {
					console.log('Image uploaded successfully:', response);
					// Update the munro with the new image URL if needed
					munro.image_url = response['image_url']; // Adjust according to API response
					this.getAllMunrosAndSync();
				},
				error => {
					console.error('Error uploading image:', error);
				},
			);
		}
	}

	private syncMunroLists() {
		this._completedMunros = [...this._allMunros.filter(item => item.completed)];
		this._uncompletedMunros = [...this._allMunros.filter(item => !item.completed)];
	}
}

