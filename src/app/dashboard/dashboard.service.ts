import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendConfig } from './../config/backend-environment';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    headers = {
        'Content-Type': 'application/json',
    };

    constructor(
        private http: HttpClient,
        private backendConfig: BackendConfig
    ) {}

    getUserDetails(userId: string): Observable<any> {
        return this.http.get(
            `${this.backendConfig.environment.production}/api/user/details/${userId}`
        );
    }

    getCompletedMunros(userId: string): Observable<any> {
        return this.http.get(
            `${this.backendConfig.environment.production}/api/munros/complete/${userId}`
        );
    }

    getIncompleteMunros(userId: string): Observable<any> {
        return this.http.get(
            `${this.backendConfig.environment.production}/api/munros/incomplete/${userId}`
        );
    }

    updateMunro(
        complete: boolean,
        userId: string,
        payload: any
    ): Observable<any> {
        const body = JSON.stringify(payload);

        console.log(
            `${this.backendConfig.environment.production}/api/munros/${
                complete ? 'mark-complete' : 'mark-incomplete'
            }/${userId}`,
            payload
        );

        return this.http.put(
            `${this.backendConfig.environment.production}/api/munros/${
                complete ? 'mark-complete' : 'mark-incomplete'
            }/${userId}`,
            body,
            { headers: this.headers }
        );
    }
}