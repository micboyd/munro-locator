import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendConfig } from './../config/backend-environment';
import { Munro } from './munro';
@Injectable()
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
            `${this.backendConfig.environment.local}/api/user/details/${userId}`
        );
    }

    getCompleteMunros(userId: string): Observable<any> {
        return this.http.get(
            `${this.backendConfig.environment.local}/api/munros/complete/${userId}`
        );
    }

    getIncompleteMunros(userId: string): Observable<any> {
        return this.http.get(
            `${this.backendConfig.environment.local}/api/munros/incomplete/${userId}`
        );
    }

    markMunroStatus(userId: string, complete: boolean, payload: any): Observable<any> {
        const body = JSON.stringify(payload);
        console.log(userId, body);
        return this.http.put(
            `${this.backendConfig.environment.local}/api/munros/${complete ? 'mark-complete' : 'mark-incomplete'}/${userId}`,
            body,
            { headers: this.headers }
        );
    }
}
