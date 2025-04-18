import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../models/LoginResponse';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { LoginRequest } from '../models/LoginRequest';
import { IJWTPayload } from '../interfaces/IJWTPayload';
import { environment } from '../../../environments/environment';
import { User } from '../models/User';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private _apiUrl = `${environment.baseApiUrl}/auth`;

	constructor(private http: HttpClient) {}

	setDetails(loginDetails: LoginResponse) {
		localStorage.setItem('id', loginDetails.user.id);
		localStorage.setItem('token', loginDetails.token);
		localStorage.setItem('fullName', `${loginDetails.user.firstname} ${loginDetails.user.lastname}`);
		localStorage.setItem('firstName', loginDetails.user.firstname);
		localStorage.setItem('lastName', loginDetails.user.lastname);
		localStorage.setItem('username', loginDetails.user.username);
	}

	login(payload: LoginRequest): Observable<LoginResponse> {
		return this.http.post<LoginResponse>(`${this._apiUrl}/login`, payload);
	}

	register(payload: User): Observable<User> {
		return this.http.post<User>(`${this._apiUrl}/register`, payload);
	}

	clearDetails() {
		localStorage.clear();
	}

	getToken(): string {
		return localStorage.getItem('token');
	}

	isTokenExpired(token: string): boolean {
		try {
			const decoded = jwtDecode<IJWTPayload>(token);
			const currentTime = Math.floor(Date.now() / 1000);

			return decoded.exp < currentTime;
		} catch (error) {
			return true;
		}
	}

	isAuthenticated(): boolean {
		const token = this.getToken();

		if (!token) {
			return false;
		} else {
			return !this.isTokenExpired(token);
		}
	}
}

