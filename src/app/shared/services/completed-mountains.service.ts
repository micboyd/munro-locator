import { Observable, map } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { CompletedMountain } from '../models/Mountains/CompletedMountain';
import { CompletedMountainRequest } from '../models/Mountains/CompletedMountainRequest';
import { CompletedMountainResponse } from '../models/Mountains/CompletedMountainResponse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PaginatedResponse } from '../models/Shared/PaginatedCollection';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CompletedMountainsService {

    private readonly _apiUrl = environment.baseApiUrl;
    private readonly _completedMountainsUrl = `${this._apiUrl}/mountains/completed-mountains`;

    constructor(
        private http: HttpClient,
        private authService: AuthenticationService,
    ) {}

    /**
     * GET /completed-mountains?userId=...&all=true
     */
    getCompletedMountainsForCurrentUser(
        sort: 'date_asc' | 'date_desc' | 'height_desc' | 'height_asc' = 'date_desc'
    ): Observable<CompletedMountain[]> {
        const userId = encodeURIComponent(this.authService.userId);

        return this.http
            .get<{ data: CompletedMountainResponse[]; total: number }>(
                `${this._completedMountainsUrl}?userId=${userId}&sort=${encodeURIComponent(sort)}&all=true`
            )
            .pipe(map((res) => res.data.map((cm) => new CompletedMountain(cm))));
    }

    /**
     * GET /completed-mountains?userId=...&page=1&limit=9&sort=date_desc
     */
    getCompletedMountainsForCurrentUserPaged(
        page = 1,
        limit = 9,
        sort: 'date_asc' | 'date_desc' | 'height_desc' | 'height_asc' = 'date_desc',
        search = ''
    ): Observable<PaginatedResponse<CompletedMountain>> {
        const userId = encodeURIComponent(this.authService.userId);
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';

        return this.http
            .get<{ data: CompletedMountainResponse[]; pagination: PaginatedResponse<CompletedMountain>['pagination'] }>(
                `${this._completedMountainsUrl}?userId=${userId}&page=${page}&limit=${limit}&sort=${encodeURIComponent(sort)}${searchParam}`
            )
            .pipe(
                map((res) => ({
                    data: res.data.map((cm) => new CompletedMountain(cm)),
                    pagination: res.pagination,
                }))
            );
    }

    /**
     * GET /completed-mountains/:id
     */
    getCompletedMountainById(id: string): Observable<CompletedMountain> {
        return this.http
            .get<CompletedMountainResponse>(`${this._completedMountainsUrl}/${encodeURIComponent(id)}`)
            .pipe(map((res) => new CompletedMountain(res)));
    }

    /**
     * POST /completed-mountains
     * Sends multipart/form-data so photos and record fields arrive in one request.
     */
    createCompletedMountain(request: CompletedMountainRequest): Observable<CompletedMountain> {
        return this.http
            .post<CompletedMountainResponse>(this._completedMountainsUrl, this.buildFormData(request, true))
            .pipe(map((res) => new CompletedMountain(res)));
    }

    /**
     * PUT /completed-mountains/:id
     */
    updateCompletedMountainById(id: string, request: CompletedMountainRequest): Observable<CompletedMountain> {
        return this.http
            .put<CompletedMountainResponse>(
                `${this._completedMountainsUrl}/${encodeURIComponent(id)}`,
                this.buildFormData(request, false)
            )
            .pipe(map((res) => new CompletedMountain(res)));
    }

    /**
     * DELETE /completed-mountains/:id
     */
    deleteCompletedMountainById(id: string): Observable<{ message: string; id: string }> {
        return this.http.delete<{ message: string; id: string }>(
            `${this._completedMountainsUrl}/${encodeURIComponent(id)}`
        );
    }

    // ---------------------------------------------------------------------------

    private buildFormData(request: CompletedMountainRequest, includeUserId: boolean): FormData {
        const fd = new FormData();

        if (includeUserId) {
            fd.append('userId', this.authService.userId);
        }

        fd.append('mountainId', request.mountainId);
        fd.append('dateCompleted', request.dateCompleted.toISOString());
        fd.append('notes', request.notes ?? '');
        fd.append('rating', String(request.rating));

        for (const file of request.summitPhotos ?? []) {
            fd.append('summitPhotos', file, file.name);
        }

        return fd;
    }
}
