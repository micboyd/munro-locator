import { Observable, map } from 'rxjs';

import { AuthenticationService } from './authentication.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TripPlan } from '../models/TripPlan/TripPlan';
import { TripPlanResponse } from '../models/TripPlan/TripPlanResponse';
import { environment } from '../../../environments/environment';

export interface TripPlanRequest {
    title: string;
    description?: string | null;
    startDate?: string | null;
    endDate?: string | null;
}

@Injectable({ providedIn: 'root' })
export class TripPlansService {

    private readonly _url = `${environment.baseApiUrl}/mountains/trip-plans`;

    constructor(
        private http: HttpClient,
        private authService: AuthenticationService
    ) {}

    getAll(): Observable<TripPlan[]> {
        const userId = encodeURIComponent(this.authService.userId);
        return this.http
            .get<TripPlanResponse[]>(`${this._url}?userId=${userId}`)
            .pipe(map(res => res.map(t => new TripPlan(t))));
    }

    getById(id: string): Observable<TripPlan> {
        return this.http
            .get<TripPlanResponse>(`${this._url}/${encodeURIComponent(id)}`)
            .pipe(map(res => new TripPlan(res)));
    }

    create(request: TripPlanRequest): Observable<TripPlan> {
        return this.http
            .post<TripPlanResponse>(this._url, {
                userId: this.authService.userId,
                ...request,
            })
            .pipe(map(res => new TripPlan(res)));
    }

    update(id: string, request: Partial<TripPlanRequest>): Observable<TripPlan> {
        return this.http
            .put<TripPlanResponse>(`${this._url}/${encodeURIComponent(id)}`, request)
            .pipe(map(res => new TripPlan(res)));
    }

    delete(id: string): Observable<{ message: string; id: string }> {
        return this.http.delete<{ message: string; id: string }>(
            `${this._url}/${encodeURIComponent(id)}`
        );
    }

    addMountain(tripId: string, mountainId: string): Observable<TripPlan> {
        return this.http
            .post<TripPlanResponse>(`${this._url}/${encodeURIComponent(tripId)}/mountains`, { mountainId })
            .pipe(map(res => new TripPlan(res)));
    }

    removeMountain(tripId: string, mountainId: string): Observable<TripPlan> {
        return this.http
            .delete<TripPlanResponse>(
                `${this._url}/${encodeURIComponent(tripId)}/mountains/${encodeURIComponent(mountainId)}`
            )
            .pipe(map(res => new TripPlan(res)));
    }
}
