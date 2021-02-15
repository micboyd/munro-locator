import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BackendConfig } from './../config/backend-environment';

@Injectable()
export class DashboardService {
    constructor(
        private http: HttpClient,
        private backendConfig: BackendConfig
    ) {}

    getCompleteMunros(userId: string): Observable<any> {
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
