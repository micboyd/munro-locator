import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map } from "rxjs";

import { environment } from "../../../environments/environment";

import { Mountain } from "../../shared/models/Mountains/Mountain";
import { MountainRequest } from "../../shared/models/Mountains/MountainRequest";
import { MountainResponse } from "../../shared/models/Mountains/MountainResponse";
import { Category } from "../../shared/models/Mountains/Category";

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    pagination: Pagination;
}

@Injectable()
export class LibraryService {
    private readonly _apiUrl = environment.baseApiUrl;
    private readonly _mountainsUrl = `${this._apiUrl}/mountains/mountains`;

    constructor(private http: HttpClient) { }

    /**
     * GET /mountains/mountains
     * Fetch all mountains (optionally filtered/paginated)
     *
     * Returns domain models (Mountain) wrapped in PaginatedResponse.
     */
    getAll(
        params?: any
    ): Observable<PaginatedResponse<Mountain>> {
        return this.http
            .get<PaginatedResponse<MountainResponse>>(this._mountainsUrl, { params })
            .pipe(
                map((res) => ({
                    ...res,
                    data: res.data.map((dto) => new Mountain(dto)),
                }))
            );
    }

    /**
     * GET /mountains/mountains/categories
     * Fetch all mountain categories.
     */
    getCategories(): Observable<Category[]> {
        return this.http
            .get<string[]>(`${this._mountainsUrl}/categories`)
            .pipe(map((cats) => cats.map((c) => new Category({ name: c }))));
    }

    /**
     * POST /mountains/mountains
     * Create a mountain.
     *
     * Returns domain model (Mountain).
     */
    create(request: MountainRequest): Observable<Mountain> {
        return this.http
            .post<MountainResponse>(this._mountainsUrl, request)
            .pipe(map((dto) => new Mountain(dto)));
    }

    /**
     * PUT /mountains/mountains/:id
     * Update mountain by Mongo _id
     *
     * Backend supports partial updates, so we accept Partial<MountainRequest>.
     * Returns domain model (Mountain).
     */
    updateById(id: string, updates: Partial<MountainRequest>): Observable<Mountain> {
        return this.http
            .put<MountainResponse>(`${this._mountainsUrl}/${encodeURIComponent(id)}`, updates)
            .pipe(map((dto) => new Mountain(dto)));
    }

    /**
     * DELETE /mountains/mountains/:id
     * Delete mountain by Mongo _id
     */
    deleteById(id: string): Observable<{ message: string; id: string }> {
        return this.http.delete<{ message: string; id: string }>(
            `${this._mountainsUrl}/${encodeURIComponent(id)}`
        );
    }
}