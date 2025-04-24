import { Component, OnInit } from "@angular/core";
import { combineLatest, debounceTime } from "rxjs";
import { faEdit, faSearch } from "@fortawesome/free-solid-svg-icons";

import { CompletedMunro } from "../../shared/models/CompletedMunro";
import { FormControl } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Munro } from "../../shared/models/Munro";
import { MunroService } from "../../shared/services/munros.service";
import { Router } from "@angular/router";
import { UserService } from "../../shared/services/user.service";
import { environment } from "../../../environments/environment";

@Component({
	selector: 'app-mountain-manager',
	templateUrl: './mountain-manager.component.html',
	standalone: false,
})
export class MountainManagerComponent implements OnInit {
	private _apiUrl = `${environment.baseApiUrl}/munros`;

	constructor(
		private munroService: MunroService,
		private userService: UserService,
		private http: HttpClient,
        private router: Router
	) {}

	munrosLoading: boolean = false;
	activeTab = 0;

    faEdit = faEdit;
	faSearch = faSearch;
	searchControl = new FormControl('');
	searchQuery: string = '';
	tabs = [];

	get displayMunros(): Array<Munro> {
		const baseList = (() => {
			switch (this.activeTab) {
				case 1:
					return this.munroService.completedMunros;
				case 2:
					return this.munroService.uncompletedMunros;
				default:
					return this.munroService.allMunros;
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
			this.munroService.allMunros = allMunros;
			this.munroService.userCompletedMunros = completedMunros;

			const completedIds = new Set(completedMunros.map(m => m.munroId));
			this.munroService.allMunros.forEach(m => {
				m.completed = completedIds.has(m._id);
			});

			this.syncMunroLists();
			this.updateTabs();
			this.munrosLoading = false;
		});
	}

	updateTabs() {
		const query = this.searchQuery.toLowerCase();
		const filterFn = (m: Munro) =>
			!query ||
			m.hill_name?.toLowerCase().includes(query) ||
			m.region_name?.toLowerCase().includes(query);

		this.tabs = [
			{ label: 'All', count: () => this.munroService.allMunros.filter(filterFn).length },
			{ label: 'Complete', count: () => this.munroService.completedMunros.filter(filterFn).length },
			{ label: 'Incomplete', count: () => this.munroService.uncompletedMunros.filter(filterFn).length },
		];
	}

	munroCompletedUpdated(munro: Munro, completed: boolean) {
		if (completed) {
			const newCompleted = new CompletedMunro();
			newCompleted.munroId = munro._id;

			this.munroService.updatedUserCompletedMunros(newCompleted).subscribe(() => {
				munro.completed = true;
				this.munroService.userCompletedMunros = [
					...this.munroService.userCompletedMunros,
					newCompleted
				];
				this.syncMunroLists();
				this.munroService.allMunros = [...this.munroService.allMunros];
			});
		} else {
			this.munroService.removeCompletedMunro(munro._id).subscribe(() => {
				munro.completed = false;
				this.munroService.userCompletedMunros = this.munroService.userCompletedMunros.filter(
					c => c.munroId !== munro._id
				);
				this.syncMunroLists();
				this.munroService.allMunros = [...this.munroService.allMunros];
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
					munro.image_url = response['image_url'];
					this.getAllMunrosAndSync();
				},
				error => {
					console.error('Error uploading image:', error);
				},
			);
		}
	}

    openMunroView(munroId: string) {
        this.router.navigate([`${munroId}`]);
    }

	private syncMunroLists() {
		this.munroService.completedMunros = [
			...this.munroService.allMunros.filter(m => m.completed),
		];
		this.munroService.uncompletedMunros = [
			...this.munroService.allMunros.filter(m => !m.completed),
		];
	}
}
