import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';

import { CompletedMountain } from '../../shared/models/Mountains/CompletedMountain';
import { CompletedMountainsService } from '../../shared/services/completed-mountains.service';
import { DialogService } from '../../shared/components/dialog/dialog.service';
import { Mountain } from '../../shared/models/Mountains/Mountain';
import { PlannedMountain } from '../../shared/models/Mountains/PlannedMountain';
import { PlannedMountainsService } from '../../shared/services/planned-mountains.service';
import { Pagination } from '../../shared/models/Shared/PaginatedCollection';

type SortOption = 'height_desc' | 'height_asc';

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
    private _completedLoading = false;
    private _completedLoaded = false;

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
                    ).pipe(finalize(() => (this._loading = false)))
                )
            )
            .subscribe((res) => {
                this._plannedMountains = res.data;
                this._pagination = res.pagination;
            });

        this.reload$.next();
    }

    changeTab(tab: string) {
        this.activeTab = tab;

        if (tab === 'Completed' && !this._completedLoaded) {
            this.loadCompletedMountains();
        }
    }

    private loadCompletedMountains(): void {
        this._completedLoading = true;
        this._completedLoaded = true;

        this.completedMountainsService.getCompletedMountainsForCurrentUser()
            .pipe(finalize(() => (this._completedLoading = false)))
            .subscribe({
                next: (data) => (this._completedMountains = data),
                error: () => (this._completedMountains = []),
            });
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
        this.completingMountain = null;
        this.reload$.next();
        // Force a refresh of the completed list next time it's viewed
        this._completedLoaded = false;
    }

    deletedPlannedMountain(mountainId: string) {
        this.plannedMountainService.deletePlannedMountainById(mountainId).subscribe(() => {
            this.reload$.next();
        });
    }
}
