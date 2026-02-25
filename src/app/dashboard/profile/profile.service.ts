import { Observable, map } from 'rxjs';

import { AuthenticationService } from '../../shared/services/authentication.service';
import { Goal } from '../../shared/models/Profile/Goal';
import { GoalRequest } from '../../shared/models/Profile/GoalRequest';
import { GoalResponse } from '../../shared/models/Profile/GoalResponse';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfile } from '../../shared/models/Profile/UserProfile';
import { UserProfileRequest } from '../../shared/models/Profile/UserProfileRequest';
import { UserProfileResponse } from '../../shared/models/Profile/UserProfileResponse';
import { environment } from '../../../environments/environment';

@Injectable(
    { providedIn: 'root' }
)
export class ProfileService {
    private readonly _apiUrl = environment.baseApiUrl;

    private readonly _profileUrl = `${this._apiUrl}/profile/user-profile`;
    private readonly _goalsUrl = `${this._apiUrl}/profile/goals`;

    constructor(
        private http: HttpClient,
        private authService: AuthenticationService
    ) { }

    /**
     * GET /user-profile/:userId
     * Fetch profile by userId (string)
     */
    getProfileByUserId(): Observable<UserProfile> {
        return this.http
            .get<UserProfileResponse>(
                `${this._profileUrl}/${encodeURIComponent(this.authService.userId)}`
            )
            .pipe(map((res) => new UserProfile(res)));
    }

    /**
     * POST /user-profile
     * Create profile (multipart/form-data)
     */
    createProfile(request: FormData): Observable<UserProfile> {
        return this.http
            .post<UserProfileResponse>(this._profileUrl, request)
            .pipe(map((res) => new UserProfile(res)));
    }

    /**
     * PUT /user-profile/:id
     * Update profile by Mongo _id
     */
    updateProfileById(id: string, updates: FormData): Observable<UserProfile> {
        return this.http
            .put<UserProfileResponse>(`${this._profileUrl}/${encodeURIComponent(id)}`, updates)
            .pipe(map((res) => new UserProfile(res)));
    }

    /**
     * DELETE /user-profile/:id
     * Delete profile by Mongo _id
     */
    deleteProfileById(id: string): Observable<{ message: string; id: string }> {
        return this.http.delete<{ message: string; id: string }>(
            `${this._profileUrl}/${encodeURIComponent(id)}`
        );
    }

    // =========================
    // ✅ GOALS ROUTES
    // =========================

    /**
     * GET /goals/:userId
     * Fetch all goals for the current user
     */
    getGoalsByUserId(): Observable<Goal[]> {
        return this.http
            .get<GoalResponse[]>(
                `${this._goalsUrl}/${encodeURIComponent(this.authService.userId)}`
            )
            .pipe(map((res) => res.map((g) => new Goal(g))));
    }

    /**
     * POST /goals
     * Create a goal
     */
    createGoal(request: GoalRequest): Observable<Goal> {
        return this.http
            .post<GoalResponse>(this._goalsUrl, request)
            .pipe(map((res) => new Goal(res)));
    }

    /**
     * PUT /goals/:id
     * Update a goal by Mongo _id
     */
    updateGoalById(
        id: string,
        updates: Partial<GoalRequest>
    ): Observable<Goal> {
        return this.http
            .put<GoalResponse>(`${this._goalsUrl}/${encodeURIComponent(id)}`, updates)
            .pipe(map((res) => new Goal(res)));
    }

    /**
     * DELETE /goals/:id
     * Delete a goal by Mongo _id
     */
    deleteGoalById(id: string): Observable<{ message: string; id: string }> {
        return this.http.delete<{ message: string; id: string }>(
            `${this._goalsUrl}/${encodeURIComponent(id)}`
        );
    }
}
