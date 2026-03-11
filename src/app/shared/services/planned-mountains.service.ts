import { Observable, map } from 'rxjs';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlannedMountain } from '../models/Mountains/PlannedMountain';
import { PlannedMountainResponse } from '../models/Mountains/PlannedMountainResponse';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PlannedMountainsService {

    private readonly _apiUrl = environment.baseApiUrl;
    private readonly _plannedMountainsUrl = `${this._apiUrl}/mountains/planned-mountains`;

    constructor(
        private http: HttpClient,
        private authService: AuthenticationService
    ) { }

    /**
     * GET /planned-mountains?userId=...&sort=date_asc&all=true
     * Fetch ALL planned mountains for current user (returns populated mountain)
     */
    getPlannedMountainsForCurrentUser(
        sort: 'date_asc' | 'date_desc' | 'newest' | 'oldest' | 'height_desc' | 'height_asc' = 'date_desc'
    ): Observable<PlannedMountain[]> {
        const userId = encodeURIComponent(this.authService.userId);

        return this.http
            .get<{ data: PlannedMountainResponse[]; total: number }>(
                `${this._plannedMountainsUrl}?userId=${userId}&sort=${encodeURIComponent(
                    sort
                )}&all=true`
            )
            .pipe(map((res) => res.data.map((pm) => new PlannedMountain(pm))));
    }

    /**
     * GET /planned-mountains?userId=...&page=1&limit=10&sort=date_desc
     * Paginated planned mountains for current user
     */
    getPlannedMountainsForCurrentUserPaged(
        page = 1,
        limit = 10,
        sort: 'date_asc' | 'date_desc' | 'newest' | 'oldest' | 'height_desc' | 'height_asc' = 'height_desc',
        search = ''
    ): Observable<{
        data: PlannedMountain[];
        pagination: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
            hasNextPage: boolean;
            hasPrevPage: boolean;
        };
    }> {
        const userId = encodeURIComponent(this.authService.userId);
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';

        return this.http
            .get<{
                data: PlannedMountainResponse[];
                pagination: {
                    total: number;
                    page: number;
                    limit: number;
                    totalPages: number;
                    hasNextPage: boolean;
                    hasPrevPage: boolean;
                };
            }>(
                `${this._plannedMountainsUrl}?userId=${userId}&page=${page}&limit=${limit}&sort=${encodeURIComponent(sort)}${searchParam}`
            )
            .pipe(
                map((res) => ({
                    data: res.data.map((pm) => new PlannedMountain(pm)),
                    pagination: res.pagination,
                }))
            );
    }

    /**
     * GET /planned-mountains/:id
     * Fetch a single planned mountain by Mongo _id (populated mountain)
     */
    getPlannedMountainById(id: string): Observable<PlannedMountain> {
        return this.http
            .get<PlannedMountainResponse>(
                `${this._plannedMountainsUrl}/${encodeURIComponent(id)}`
            )
            .pipe(map((res) => new PlannedMountain(res)));
    }

    /**
     * POST /planned-mountains
     * Create a planned mountain
     * Body: { userId, mountainId, plannedDate }
     * Response: PlannedMountain (with populated mountain)
     */
    createPlannedMountain(mountainId: string, plannedDate: Date): Observable<PlannedMountain> {
        return this.http
            .post<PlannedMountainResponse>(this._plannedMountainsUrl, {
                userId: this.authService.userId,
                mountainId,
                plannedDate, // HttpClient will serialize Date -> ISO string
            })
            .pipe(map((res) => new PlannedMountain(res)));
    }

    /**
     * PUT /planned-mountains/:id
     * Update a planned mountain (mountainId and/or plannedDate)
     * Response: PlannedMountain (with populated mountain)
     */
    updatePlannedMountainById(
        id: string,
        updates: { mountainId?: string; plannedDate?: Date }
    ): Observable<PlannedMountain> {
        return this.http
            .put<PlannedMountainResponse>(
                `${this._plannedMountainsUrl}/${encodeURIComponent(id)}`,
                updates
            )
            .pipe(map((res) => new PlannedMountain(res)));
    }

    /**
     * DELETE /planned-mountains/:id
     */
    deletePlannedMountainById(id: string): Observable<{ message: string; id: string }> {
        return this.http.delete<{ message: string; id: string }>(
            `${this._plannedMountainsUrl}/${encodeURIComponent(id)}`
        );
    }
}
