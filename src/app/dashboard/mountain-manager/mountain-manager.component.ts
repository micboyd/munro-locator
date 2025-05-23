import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { map, shareReplay, startWith } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { ILocationSetting } from '../../shared/interfaces/ILocationSetting';
import { MunroService } from '../../shared/services/munros.service';
import { UserMunro } from '../../shared/models/UserMunro';

@Component({
	selector: 'app-munro-list',
	templateUrl: './mountain-manager.component.html',
	standalone: false,
})
export class MountainManagerComponent implements OnInit {
	// Filter handling
	filterValue: string = '';
	private filterSubject = new BehaviorSubject<string>('');

	// Munro lists
	munrosLoading = true;
	munroStatus$: Observable<UserMunro[]>;

	// Filtered lists
	filteredAllMunros$: Observable<UserMunro[]>;
	filteredCompletedMunros$: Observable<UserMunro[]>;
	filteredIncompleteMunros$: Observable<UserMunro[]>;

	filterControl = new FormControl('');

	// Map view
	viewLocationSetting: ILocationSetting = {
		zoom: 8,
		center: {
			latitude: 56.8493796,
			longitude: -4.5336288,
		},
	};

	constructor(private munroService: MunroService) {}

	ngOnInit(): void {
		this.loadMunros();

		this.filterControl.valueChanges.pipe(startWith('')).subscribe(value => this.filterSubject.next(value ?? ''));
	}

	// Handles input change for the filter
	onFilterChange(value: string) {
		this.filterSubject.next(value ?? '');
	}

	// For map centering
	locateMunro(latitude: number, longitude: number) {
		this.viewLocationSetting = {
			zoom: 13,
			center: { latitude, longitude },
		};
	}

	// Loads Munros and sets up filtering
	private loadMunros() {
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
			shareReplay(1),
		);

		// Filtered observables
		const filtered$ = (predicate: (munro: UserMunro) => boolean) =>
			combineLatest([this.munroStatus$, this.filterSubject.pipe(startWith(''))]).pipe(
				map(([munros, filter]) =>
					munros.filter(m => predicate(m) && m.hill_name.toLowerCase().includes(filter.toLowerCase())),
				),
			);

		this.filteredAllMunros$ = filtered$(_ => true);
		this.filteredCompletedMunros$ = filtered$(m => m.completed);
		this.filteredIncompleteMunros$ = filtered$(m => !m.completed);

		// Update loading state
		this.munroStatus$.subscribe(() => (this.munrosLoading = false));
	}

	// Optional: titles that update with filtering
	get allTitle(): Observable<string> {
		return this.filteredAllMunros$.pipe(map(list => `All Munros (${list.length})`));
	}
	get allCompletedTitle(): Observable<string> {
		return this.filteredCompletedMunros$.pipe(map(list => `Complete Munros (${list.length})`));
	}
	get allIncompleteTitle(): Observable<string> {
		return this.filteredIncompleteMunros$.pipe(map(list => `Incomplete Munros (${list.length})`));
	}
}
