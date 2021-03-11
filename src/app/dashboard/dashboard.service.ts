import { User } from './../../models/user';
import { Munro } from '../../models/munro';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BackendConfig } from './../config/backend-environment';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {

    currentUser = localStorage.getItem('userid');
    completeMunros: Munro[];
    incompleteMunros: Munro[];

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
}
