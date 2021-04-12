import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendConfig } from './../config/backend-environment';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {


    currentUser: string = localStorage.getItem('userid');

    headers = {
        'Content-Type': 'application/json',
    };

    constructor(
        private http: HttpClient,
        private backendConfig: BackendConfig
    ) {}

    // Get the details of the logged in user
    getUserDetails(userId: string): Observable<any> {
        return this.http.get(
            `${this.backendConfig.environment.production}/api/user/details/${userId}`
        );
    }

    // Get the users complete munros
    getCompletedMunros(userId: string): Observable<any> {
        return this.http.get(
            `${this.backendConfig.environment.production}/api/munros/complete/${userId}`
        );
    }

    // Get the users incomplete munros
    getIncompleteMunros(userId: string): Observable<any> {
        return this.http.get(
            `${this.backendConfig.environment.production}/api/munros/incomplete/${userId}`
        );
    }

    // Change the status of a munro (complete or incomplete)
    updateMunro(
        incomplete: boolean,
        userId: string,
        payload: any
    ): Observable<any> {
        const body = JSON.stringify(payload);

        return this.http.put(
            `${this.backendConfig.environment.production}/api/munros/${
                incomplete ? 'mark-complete' : 'mark-incomplete'
            }/${userId}`,
            body,
            { headers: this.headers }
        );
    }
}
