import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserProfile } from '../../shared/models/Profile/UserProfile';
import { UserProfileRequest } from '../../shared/models/Profile/UserProfileRequest';
import { UserProfileResponse } from '../../shared/models/Profile/UserProfileResponse';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class ProfileService {
    private readonly _apiUrl = environment.baseApiUrl;
    private readonly _profileUrl = `${this._apiUrl}/profile/user-profile`;

    constructor(private http: HttpClient) {}

    /**
     * GET /user-profile/:userId
     * Fetch profile by userId (string)
     */
    getByUserId(userId: string): Observable<UserProfile> {
        return this.http
            .get<UserProfileResponse>(`${this._profileUrl}/${encodeURIComponent(userId)}`)
            .pipe(map((res) => new UserProfile(res)));
    }

    /**
     * POST /user-profile
     * Create profile
     */
    create(request: UserProfileRequest): Observable<UserProfile> {
        return this.http
            .post<UserProfileResponse>(this._profileUrl, request)
            .pipe(map((res) => new UserProfile(res)));
    }

    /**
     * PUT /user-profile/:id
     * Update profile by Mongo _id
     * (Your backend allows: firstName, lastName, bio, profileImage, userId)
     */
    updateById(id: string, updates: Partial<UserProfileRequest>): Observable<UserProfile> {
        return this.http
            .put<UserProfileResponse>(`${this._profileUrl}/${encodeURIComponent(id)}`, updates)
            .pipe(map((res) => new UserProfile(res)));
    }

    /**
     * DELETE /user-profile/:id
     * Delete profile by Mongo _id
     */
    deleteById(id: string): Observable<{ message: string; id: string }> {
        return this.http.delete<{ message: string; id: string }>(
            `${this._profileUrl}/${encodeURIComponent(id)}`
        );
    }

    /**
     * Convenience helper:
     * "Upsert" behavior using your current API shape:
     * - try getByUserId
     * - if 404, create
     */
    getOrCreate(request: UserProfileRequest): Observable<UserProfile> {
        return new Observable<UserProfile>((subscriber) => {
            this.getByUserId(request.userId).subscribe({
                next: (profile) => {
                    subscriber.next(profile);
                    subscriber.complete();
                },
                error: (err) => {
                    if (err?.status === 404) {
                        this.create(request).subscribe({
                            next: (created) => {
                                subscriber.next(created);
                                subscriber.complete();
                            },
                            error: (createErr) => subscriber.error(createErr),
                        });
                    } else {
                        subscriber.error(err);
                    }
                },
            });
        });
    }
}
