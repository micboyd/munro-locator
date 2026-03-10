import { Component, OnInit } from '@angular/core';
import { LibraryService, PaginatedResponse } from './library.service';
import { Observable, Subject, forkJoin, map } from 'rxjs';
import { catchError, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';

import { Category } from '../../shared/models/Mountains/Category';
import { HttpParams } from '@angular/common/http';
import { Mountain } from '../../shared/models/Mountains/Mountain';
import { PlannedMountainsService } from '../../shared/services/planned-mountains.service';
import { ToastService } from '../../shared/services/toast.service';

type SortOption = 'height_desc' | 'height_asc';

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    providers: [LibraryService],
    standalone: false,
})
export class LibraryComponent implements OnInit {

    mapOpen = false;
    addedMountainIds = new Set<string>();

    private _mountains: PaginatedResponse<Mountain>;
    private _categories: Category[] = [];

    private _mapMountains: Mountain[] = [];
    private _mapMountainsLoading = false;

    private _componentLoading = true;
    private _mountainsLoading = false;

    // Added sort into query
    query: { category: string; page: number; search: string; sort: SortOption } = {
        category: '',
        page: 1,
        search: '',
        sort: 'height_desc',
    };

    private readonly reload$ = new Subject<void>();

    constructor(
        private libraryService: LibraryService,
        private plannedMountainService: PlannedMountainsService,
        private toastService: ToastService
    ) { }

    get componentLoading() {
        return this._componentLoading;
    }

    get mountainsLoading() {
        return this._mountainsLoading;
    }

    get mapMountainsLoading() {
        return this._mapMountainsLoading;
    }

    get mapMountainsCollection() {
        return this._mapMountains;
    }

    get categories() {
        return ['All', ...this._categories.map(x => x.name)];
    }

    get mountains() {
        return this._mountains;
    }

    get mountainsCollection() {
        return (this._mountains?.data ?? []).map((m) => new Mountain(m));
    }

    get mountainsCount() {
        return (this._mountains.pagination.total);
    }

    get defaultCategory() {
        return this.categories[0] || '';
    }

    ngOnInit(): void {
        forkJoin({
            mountains: this.getMountains(),
            categories: this.getCategories(),
        })
            .pipe(
                finalize(() => (this._componentLoading = false)),
                catchError(() => {
                    this._mountains = { data: [], pagination: { page: 1, totalPages: 1, totalCount: 0 } } as any;
                    this._categories = [];
                    return [];
                })
            )
            .subscribe((result: any) => {
                if (!result) return;
                const { mountains, categories } = result;

                this._mountains = mountains;
                this._categories = categories;
            });

        this.reload$
            .pipe(
                tap(() => (this._mountainsLoading = true)),
                distinctUntilChanged(() => false),
                switchMap(() =>
                    this.getMountains().pipe(
                        catchError(() => {
                            return new Observable<PaginatedResponse<Mountain>>((sub) => {
                                sub.next({ data: [], pagination: { page: this.query.page, totalPages: 1, totalCount: 0 } } as any);
                                sub.complete();
                            });
                        }),
                        finalize(() => (this._mountainsLoading = false))
                    )
                )
            )
            .subscribe((mountains) => {
                this._mountains = mountains;
            });
    }

    onTabChange(category: string): void {
        this.query.category = category;
        if (this.query.category === 'All') {
            this.query.category = '';
        }
        this.query.page = 1;
        this.reloadMountains();

        if (this.mapOpen) this.refreshMapData();
    }

    onPageChange(page: number): void {
        this.query.page = page;
        this.reloadMountains();
    }

    onSearchChange(term: string): void {
        this.query.search = term;
        this.query.page = 1;
        this.reloadMountains();

        if (this.mapOpen) this.refreshMapData();
    }

    onSortChange(sort: string): void {
        const allowed: SortOption[] = ['height_desc', 'height_asc'];
        this.query.sort = (allowed.includes(sort as SortOption) ? (sort as SortOption) : 'height_desc');

        this.query.page = 1;
        this.reloadMountains();

        if (this.mapOpen) this.refreshMapData();
    }

    openMap(single?: Mountain): void {
        this.mapOpen = true;

        if (single) {
            this._mapMountains = [single];
        } else {
            this._mapMountainsLoading = true;
            this.getAllMountainsForMap()
                .pipe(finalize(() => (this._mapMountainsLoading = false)))
                .subscribe({
                    next: (data) => (this._mapMountains = data),
                    error: () => (this._mapMountains = []),
                });
        }
    }

    selectedMountain(mountain: Mountain): void {
        this.addPlannedMountain(mountain);

        if (this.mapOpen) {
            this.closeMap();
        }
    }

    closeMap(): void {
        this.mapOpen = false;
    }

    addPlannedMountain(mountain: Mountain) {
        this.plannedMountainService.createPlannedMountain(mountain._id, new Date()).subscribe({
            next: () => {
                this.addedMountainIds.add(mountain._id);
                this.toastService.show(`${mountain.name} added to your planner!`);
            }
        });
    };

    private getCategories(): Observable<Category[]> {
        return this.libraryService.getCategories().pipe(
            map((categories) => categories.map((c) => new Category(c)))
        );
    }

    private getMountains(): Observable<PaginatedResponse<Mountain>> {
        const params = new HttpParams({ fromObject: this.query as any });
        return this.libraryService.getAll(params);
    }

    private getAllMountainsForMap(): Observable<Mountain[]> {
        const params = new HttpParams({
            fromObject: {
                category: this.query.category || '',
                search: this.query.search || '',
                sort: this.query.sort || 'createdAt_desc',
                all: 'true',
            }
        });

        return this.libraryService.getAll(params).pipe(
            map((res: any) => (res.data ?? []).map((m: any) => new Mountain(m)))
        );
    }

    private reloadMountains(): void {
        this.reload$.next();
    }

    private refreshMapData(): void {
        this._mapMountainsLoading = true;
        this.getAllMountainsForMap()
            .pipe(finalize(() => (this._mapMountainsLoading = false)))
            .subscribe({
                next: (data) => (this._mapMountains = data),
                error: () => (this._mapMountains = []),
            });
    }
}
