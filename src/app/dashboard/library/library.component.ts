import { Component, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { forkJoin, map, Observable, Subject } from 'rxjs';
import { catchError, distinctUntilChanged, finalize, switchMap, tap } from 'rxjs/operators';

import { LibraryService, PaginatedResponse } from './library.service';
import { Mountain } from '../../shared/models/Mountains/Mountain';

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    providers: [LibraryService],
    standalone: false,
})
export class LibraryComponent implements OnInit {

    mapOpen = false;

    private _mountains!: PaginatedResponse<Mountain>;
    private _categories: string[] = [];

    private _componentLoading = true;
    private _mountainsLoading = false;

    query: { category: string; page: number; search: string } = {
        category: '',
        page: 1,
        search: '',
    };

    private readonly reload$ = new Subject<void>();

    constructor(private libraryService: LibraryService) { }

    get componentLoading() {
        return this._componentLoading;
    }

    get mountainsLoading() {
        return this._mountainsLoading;
    }

    get categories() {
        return this._categories;
    }

    get mountains() {
        return this._mountains;
    }

    get mountainsCollection() {
        return (this._mountains?.data ?? []).map((m) => new Mountain(m));
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
                        catchError((err) => {
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
        this.query.page = 1;
        this.reloadMountains();
    }

    onPageChange(page: number): void {
        this.query.page = page;
        this.reloadMountains();
    }

    onSearchChange(term: string): void {
        this.query.search = term;
        this.query.page = 1;
        this.reloadMountains();
    }

    openMap(): void {
        this.mapOpen = true;
    }

    closeMap(): void {
        this.mapOpen = false;
    }

    private getCategories(): Observable<string[]> {
        return this.libraryService.getCategories().pipe(map((categories) => categories.map((c) => c.name)));
    }

    private getMountains(): Observable<PaginatedResponse<Mountain>> {
        const params = new HttpParams({ fromObject: this.query as any });
        return this.libraryService.getAll(params);
    }

    private reloadMountains(): void {
        this.reload$.next();
    }
}