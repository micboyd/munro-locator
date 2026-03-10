import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';

import { DialogService } from '../../shared/components/dialog/dialog.service';
import { PlannedMountain } from '../../shared/models/Mountains/PlannedMountain';
import { PlannedMountainsService } from '../../shared/services/planned-mountains.service';
import { Pagination } from '../../shared/models/Shared/PaginatedCollection';

type SortOption = 'date_desc' | 'date_asc' | 'newest' | 'oldest';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    providers: [DialogService],
    standalone: false,
})
export class BoardComponent implements OnInit {

    constructor(public plannedMountainService: PlannedMountainsService) {}

    private _plannedMountains: PlannedMountain[] = [];
    private _pagination: Pagination | null = null;
    private _loading = false;
    private readonly reload$ = new Subject<void>();

    activeTab = 'Planned';

    query: { page: number; sort: SortOption; search: string } = {
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

    get cateogries() {
        return ['Planned', 'Completed'];
    }

    ngOnInit(): void {
        this.reload$
            .pipe(
                tap(() => (this._loading = true)),
                distinctUntilChanged(() => false),
                switchMap(() =>
                    this.plannedMountainService.getPlannedMountainsForCurrentUserPaged(
                        this.query.page,
                        10,
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
    }

    onSortChange(sort: string): void {
        const allowed: SortOption[] = ['date_desc', 'date_asc', 'newest', 'oldest'];
        this.query.sort = allowed.includes(sort as SortOption) ? (sort as SortOption) : 'date_desc';
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

    deletedPlannedMountain(mountainId: string) {
        this.plannedMountainService.deletePlannedMountainById(mountainId).subscribe(() => {
            this.reload$.next();
        });
    }
}
