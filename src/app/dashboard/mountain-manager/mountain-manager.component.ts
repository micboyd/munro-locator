import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { MunroService } from '../../shared/services/munros.service';
import { UserMunro } from '../../shared/models/UserMunro';

@Component({
	selector: 'app-munro-list',
	templateUrl: './mountain-manager.component.html',
	standalone: false,
})
export class MountainManagerComponent implements OnInit {
	private _allUserMunros: UserMunro[];
	private _allUserCompletedMunros: UserMunro[];
	private _allUserIncompleteMunros: UserMunro[];

	munrosLoading: boolean = true;
	munroStatus$: Observable<UserMunro[]>;

	constructor(private munroService: MunroService) {}

	ngOnInit(): void {
		this.getAllMunros();
	}

	get allTitle(): string {
		return `All Munros (${this.allUserMunros.length})`;
	}

	get allCompletedTitle(): string {
		return `Complete Munros (${this.allCompletedUserMunros.length})`;
	}

	get allIncompleteTitle(): string {
		return `Incomplete Munros (${this.allIncompleteUserMunros.length})`;
	}

	get allUserMunros() {
		return this._allUserMunros;
	}

	get allCompletedUserMunros() {
		return this._allUserCompletedMunros;
	}

	get allIncompleteUserMunros() {
		return this._allUserIncompleteMunros;
	}

	getAllMunros() {
		const allMunros$ = this.munroService.getMunros();
		const completedMunros$ = this.munroService.getUserCompletedMunros();
		this.munrosLoading = true;

		this.munroStatus$ = combineLatest([allMunros$, completedMunros$]).pipe(
			map(([allMunros, completedMunros]) => {
				const completedMap = new Map(completedMunros.map(c => [c.munroId, c]));
				return allMunros.map(
					munro => new UserMunro(munro, completedMap.has(munro._id), completedMap.get(munro._id) ?? null),
				);
			}),
		);

		this.munroStatus$.subscribe(data => {
			this._allUserMunros = data;
			this._allUserCompletedMunros = data.filter(value => value.completed);
			this._allUserIncompleteMunros = data.filter(value => !value.completed);
			this.munrosLoading = false;
		});
	}
}

