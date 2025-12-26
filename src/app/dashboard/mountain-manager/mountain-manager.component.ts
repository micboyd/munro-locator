import { BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { map, startWith, takeUntil } from 'rxjs/operators';

import { FormControl } from '@angular/forms';
import { ILocationSetting } from '../../shared/interfaces/ILocationSetting';
import { MunroService } from '../../shared/services/munros.service';
import { UserMunro } from '../../shared/models/UserMunro';

@Component({
	selector: 'app-munro-list',
	templateUrl: './mountain-manager.component.html',
	standalone: false,
})
export class MountainManagerComponent implements OnInit, OnDestroy {
	// Filter control
	filterControl = new FormControl('');
	private filterSubject = new BehaviorSubject<string>('');
	private destroy$ = new Subject<void>();

	// Pagination
	readonly pageSize = 52;
	private pageIndex$ = new BehaviorSubject<number>(0);
	pageIndex: number = 0;

	// Munro data
	munrosLoading = true;
	munroStatus: UserMunro[] = [];
	filteredAllMunros: UserMunro[] = [];
	pagedMunros: UserMunro[] = [];
	totalMunros: number = 0;
    mapDialogOpen = false;

	// Optional subsets
	filteredCompletedMunros: UserMunro[] = [];
	filteredIncompleteMunros: UserMunro[] = [];

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

		this.filterControl.valueChanges
			.pipe(startWith(''), takeUntil(this.destroy$))
			.subscribe(value => this.filterSubject.next(value ?? ''));

		this.pageIndex$.pipe(takeUntil(this.destroy$)).subscribe(index => {
			this.pageIndex = index;
			this.updatePagedMunros();
		});
	}

	private loadMunros(): void {
		const allMunros$ = this.munroService.getMunros();
		const completedMunros$ = this.munroService.getUserCompletedMunros();

		this.munrosLoading = true;

		combineLatest([allMunros$, completedMunros$])
			.pipe(takeUntil(this.destroy$))
			.subscribe(([allMunros, completedMunros]) => {
				const completedMap = new Map(completedMunros.map(c => [c.munroId, c]));

                console.log(allMunros)

				this.munroStatus = allMunros.map(
					munro => new UserMunro(munro, completedMap.has(munro._id), completedMap.get(munro._id) ?? null),
				);

                console.log(this.munroStatus);

				this.applyFilterAndCategorize();
				this.munrosLoading = false;
			});

		this.filterSubject.pipe(takeUntil(this.destroy$)).subscribe(() => this.applyFilterAndCategorize());
	}

	private applyFilterAndCategorize(): void {
		const filter = this.filterSubject.value.toLowerCase();
		this.filteredAllMunros = this.munroStatus.filter(m => m.hill_name.toLowerCase().includes(filter));

		this.filteredCompletedMunros = this.filteredAllMunros.filter(m => m.completed);
		this.filteredIncompleteMunros = this.filteredAllMunros.filter(m => !m.completed);

		this.totalMunros = this.filteredAllMunros.length;
		this.updatePagedMunros();
	}

	private updatePagedMunros(): void {
		const start = this.pageIndex * this.pageSize;
		this.pagedMunros = this.filteredAllMunros.slice(start, start + this.pageSize);
	}

	nextPage(): void {
		const maxPage = Math.floor((this.totalMunros - 1) / this.pageSize);
		if (this.pageIndex < maxPage) {
			this.pageIndex$.next(this.pageIndex + 1);
		}
	}

	prevPage(): void {
		if (this.pageIndex > 0) {
			this.pageIndex$.next(this.pageIndex - 1);
		}
	}

	locateMunro(latitude: number, longitude: number): void {
        this.openMapDialog();
		this.viewLocationSetting = {
			zoom: 13,
			center: { latitude, longitude },
		};
	}

    openMapDialog(): void {
        this.mapDialogOpen = true;
    }

    closeMapDialog(): void {
        this.mapDialogOpen = false;
    }

	// Optional: derived titles
	get allTitle(): string {
		return `All Munros (${this.filteredAllMunros.length})`;
	}

	get allCompletedTitle(): string {
		return `Complete Munros (${this.filteredCompletedMunros.length})`;
	}

	get allIncompleteTitle(): string {
		return `Incomplete Munros (${this.filteredIncompleteMunros.length})`;
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
