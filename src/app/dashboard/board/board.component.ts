import { Component, OnInit } from '@angular/core';
import { Subject, of } from 'rxjs';
import { catchError, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';

import { CompletedMountain } from '../../shared/models/Mountains/CompletedMountain';
import { CompletedMountainsService } from '../../shared/services/completed-mountains.service';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { Mountain } from '../../shared/models/Mountains/Mountain';
import { PlannedMountain } from '../../shared/models/Mountains/PlannedMountain';
import { PlannedMountainsService } from '../../shared/services/planned-mountains.service';
import { Pagination } from '../../shared/models/Shared/PaginatedCollection';

type SortOption = 'height_desc' | 'height_asc';
type CompletedSortOption = 'date_desc' | 'date_asc' | 'height_desc' | 'height_asc';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    providers: [DialogService],
    standalone: false,
})
export class BoardComponent implements OnInit {

    constructor(
        public plannedMountainService: PlannedMountainsService,
        private completedMountainsService: CompletedMountainsService,
    ) {}

    private _plannedMountains: PlannedMountain[] = [];
    private _pagination: Pagination | null = null;
    private _loading = false;
    private readonly reload$ = new Subject<void>();

    private _completedMountains: CompletedMountain[] = [];
    private _completedPagination: Pagination | null = null;
    private _completedLoading = false;
    private readonly completedReload$ = new Subject<void>();

    mapOpen = false;
    private _mapMountains: Mountain[] = [];
    private _mapMountainsLoading = false;

    completingMountain: PlannedMountain | null = null;
    viewingMountain: CompletedMountain | null = null;

    activeTab = 'Planned';

    query: { page: number; sort: SortOption; search: string } = {
        page: 1,
        sort: 'height_desc',
        search: '',
    };

    completedQuery: { page: number; sort: CompletedSortOption; search: string } = {
        page: 1,
        sort: 'date_desc',
        search: '',
    };

    get track() {
        return Math.random();
    }

    get plannedMountains() {
        return this._plannedMountains;
    }

    get pagination() {
        return this._pagination;
    }

    get loading() {
        return this._loading;
    }

    get completedMountains() {
        return this._completedMountains;
    }

    get completedPagination() {
        return this._completedPagination;
    }

    get completedLoading() {
        return this._completedLoading;
    }

    get mapMountainsCollection() {
        return this._mapMountains;
    }

    get mapMountainsLoading() {
        return this._mapMountainsLoading;
    }

    get cateogries() {
        return ['Planned', 'Completed'];
    }

    get sortOptions() {
        return [
            { value: 'height_desc', label: 'Height high → low' },
            { value: 'height_asc', label: 'Height low → high' },
        ];
    }

    get completedSortOptions() {
        return [
            { value: 'date_desc', label: 'Date newest → oldest' },
            { value: 'date_asc', label: 'Date oldest → newest' },
            { value: 'height_desc', label: 'Height high → low' },
            { value: 'height_asc', label: 'Height low → high' },
        ];
    }

    ngOnInit(): void {
        this.reload$
            .pipe(
                tap(() => (this._loading = true)),
                distinctUntilChanged(() => false),
                switchMap(() =>
                    this.plannedMountainService.getPlannedMountainsForCurrentUserPaged(
                        this.query.page,
                        9,
                        this.query.sort,
                        this.query.search
                    ).pipe(
                        finalize(() => (this._loading = false)),
                        catchError(() => of({ data: [], pagination: this._pagination }))
                    )
                )
            )
            .subscribe((res) => {
                this._plannedMountains = res.data;
                this._pagination = res.pagination;
            });

        this.completedReload$
            .pipe(
                tap(() => (this._completedLoading = true)),
                distinctUntilChanged(() => false),
                switchMap(() =>
                    this.completedMountainsService.getCompletedMountainsForCurrentUserPaged(
                        this.completedQuery.page,
                        9,
                        this.completedQuery.sort,
                        this.completedQuery.search
                    ).pipe(
                        finalize(() => (this._completedLoading = false)),
                        catchError(() => of({ data: [], pagination: this._completedPagination }))
                    )
                )
            )
            .subscribe((res) => {
                this._completedMountains = res.data;
                this._completedPagination = res.pagination;
            });

        this.reload$.next();
    }

    changeTab(tab: string) {
        this.activeTab = tab;

        if (tab === 'Completed') {
            this.completedReload$.next();
        }
    }

    onSortChange(sort: string): void {
        const allowed: SortOption[] = ['height_desc', 'height_asc'];
        this.query.sort = allowed.includes(sort as SortOption) ? (sort as SortOption) : 'height_desc';
        this.query.page = 1;
        this.reload$.next();
    }

    onSearchChange(term: string): void {
        this.query.search = term;
        this.query.page = 1;
        this.reload$.next();
    }

    onPageChange(page: number): void {
        this.query.page = page;
        this.reload$.next();
    }

    onCompletedSortChange(sort: string): void {
        const allowed: CompletedSortOption[] = ['date_desc', 'date_asc', 'height_desc', 'height_asc'];
        this.completedQuery.sort = allowed.includes(sort as CompletedSortOption) ? (sort as CompletedSortOption) : 'date_desc';
        this.completedQuery.page = 1;
        this.completedReload$.next();
    }

    onCompletedSearchChange(term: string): void {
        this.completedQuery.search = term;
        this.completedQuery.page = 1;
        this.completedReload$.next();
    }

    onCompletedPageChange(page: number): void {
        this.completedQuery.page = page;
        this.completedReload$.next();
    }

    openMap(single?: Mountain): void {
        this.mapOpen = true;

        if (single) {
            this._mapMountains = [single];
            return;
        }

        this._mapMountainsLoading = true;
        this.plannedMountainService.getPlannedMountainsForCurrentUser()
            .pipe(finalize(() => (this._mapMountainsLoading = false)))
            .subscribe({
                next: (data) => (this._mapMountains = data.map(pm => pm.mountain)),
                error: () => (this._mapMountains = []),
            });
    }

    openCompletedMap(): void {
        this.mapOpen = true;
        this._mapMountainsLoading = true;
        this.completedMountainsService.getCompletedMountainsForCurrentUser()
            .pipe(finalize(() => (this._mapMountainsLoading = false)))
            .subscribe({
                next: (data) => (this._mapMountains = data.map(cm => cm.mountain)),
                error: () => (this._mapMountains = []),
            });
    }

    closeMap(): void {
        this.mapOpen = false;
    }

    startMountain(pm: PlannedMountain): void {
        this.completingMountain = pm;
    }

    viewMountain(cm: CompletedMountain): void {
        this.viewingMountain = cm;
    }

    onCompleteSaved(): void {
        const planned = this.completingMountain;
        this.completingMountain = null;
        this.completedReload$.next();

        if (planned) {
            this.plannedMountainService.deletePlannedMountainById(planned._id)
                .subscribe(() => this.reload$.next());
        } else {
            this.reload$.next();
        }
    }

    deletedPlannedMountain(mountainId: string) {
        this.plannedMountainService.deletePlannedMountainById(mountainId).subscribe(() => {
            this.reload$.next();
        });
    }

    deleteCompletedMountain(id: string): void {
        this.completedMountainsService.deleteCompletedMountainById(id).subscribe(() => {
            this.completedReload$.next();
            this.reload$.next(); // refresh planned list so mountain statuses update
        });
    }
}
