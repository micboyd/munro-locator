import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BackendConfig } from './../config/backend-environment';
import { Router } from '@angular/router';
import { User } from './../../models/user';

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    headers = {
        'Content-Type': 'application/json',
    };

    constructor(
        private http: HttpClient,
        private backendConfig: BackendConfig
    ) {}

    userAuthentication(payload: User): Observable<any> {
        const body = JSON.stringify(payload);
        return this.http.post(
            `${this.backendConfig.environment.production}/api/user/login`,
            body,
            { headers: this.headers }
        );
    }

    isAuthenticated(): boolean {
        const jwtHelper: JwtHelperService = new JwtHelperService();
        const token = localStorage.getItem('token');
        return !jwtHelper.isTokenExpired(token);
    }
}
