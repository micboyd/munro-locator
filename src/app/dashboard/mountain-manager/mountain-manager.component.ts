import { Component, OnInit } from '@angular/core';
import { combineLatest, debounceTime } from 'rxjs';

import { CompletedMunro } from '../../shared/models/CompletedMunro';
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

	munrosLoading: boolean = false;
	activeTab = 0;

	private _allMunros: Array<Munro> = [];
	private _completedMunros: Array<Munro> = [];
	private _uncompletedMunros: Array<Munro> = [];
	private _userCompletedMunros: Array<CompletedMunro> = [];

	faSearch = faSearch;
	searchControl = new FormControl('');
	searchQuery: string = '';

	tabs = [];

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

	ngOnInit() {
		this.munrosLoading = true;
		this.getAllMunrosAndSync();
	}

	getAllMunrosAndSync() {
		this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe(value => {
			this.searchQuery = value?.trim().toLowerCase() || '';
			this.updateTabs();
		});

		combineLatest([
			this.munroService.getMunros(),
			this.munroService.getUserCompletedMunros(this.userService.userId),
		]).subscribe(([allMunros, completedMunros]) => {
			this._allMunros = allMunros;

			const completedIds: string[] = completedMunros.map(munro => munro.munroId);
			const completedIdSet = new Set(completedIds);

			this._allMunros.forEach(munro => {
				munro.completed = completedIdSet.has(munro._id);
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
			{ label: 'All', count: () => this._allMunros.filter(filterFn).length },
			{ label: 'Complete', count: () => this._completedMunros.filter(filterFn).length },
			{ label: 'Incomplete', count: () => this._uncompletedMunros.filter(filterFn).length },
		];
	}

	munroCompletedUpdated(munro: Munro, completed: boolean) {
		if (completed) {
			const newCompleted = new CompletedMunro();
			newCompleted.munroId = munro._id;

			this.munroService.updatedUserCompletedMunros(newCompleted).subscribe(() => {
				munro.completed = true;
				this._userCompletedMunros.push(newCompleted);
				this.syncMunroLists();
				this._allMunros = [...this._allMunros];
			});
		} else {
			this.munroService.removeCompletedMunro(munro._id).subscribe(() => {
				munro.completed = false;
				this._userCompletedMunros = this._userCompletedMunros.filter(c => c.munroId !== munro._id);
				this.syncMunroLists();
				this._allMunros = [...this._allMunros];
			});
		}
	}

	onImageSelect(event: any, munro: Munro) {
		const file = event.target.files[0];

		if (file) {
			const formData = new FormData();
			formData.append('image', file, file.name);

			this.http.post(`${this._apiUrl}/${munro._id}/image`, formData).subscribe(
				response => {
					console.log('Image uploaded successfully:', response);
					munro.image_url = response['image_url'];
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
