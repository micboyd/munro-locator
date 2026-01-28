import { AuthRequest } from '../models/Auth/AuthRequest';
import { AuthResponse } from '../models/Auth/AuthResponse';
import { HttpClient } from '@angular/common/http';
import { IJWTPayload } from '../interfaces/IJWTPayload';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {
	private _apiUrl = `${environment.baseApiUrl}/auth`;
    private _userLoaded = false;

    get userLoaded(): boolean {
        return this._userLoaded;
    }

	constructor(private http: HttpClient) {}

	setDetails(loginDetails: AuthResponse) {

        console.log(loginDetails);

		localStorage.setItem('id', loginDetails.userId);
		localStorage.setItem('token', loginDetails.token);
        this._userLoaded = true;
	}

	login(payload: AuthRequest): Observable<AuthResponse> {
		return this.http.post<AuthResponse>(`${this._apiUrl}/login`, payload);
	}

	clearDetails() {
		localStorage.clear();
	}

    getUserId(): string {
		return localStorage.getItem('id');
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

