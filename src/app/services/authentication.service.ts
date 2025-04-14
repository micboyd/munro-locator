import { HttpClient } from '@angular/common/http';
import { ILoginRequest } from '../interfaces/ILoginRequest';
import { ILoginResponse } from '../interfaces/ILoginResponse';
import { Injectable } from '@angular/core';
import { LoginResponse } from '../models/LoginResponse';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class AuthenticationService {

    private _currentUser: LoginResponse = null;
	private _apiUrl = `${environment.baseApiUrl}/auth`;

	constructor(private http: HttpClient) {}

    set currentUser(user: LoginResponse) {
        this._currentUser = user;
    }

    get currentUser(): LoginResponse {
        return this._currentUser;
    }

    get fullName(): string {
        return `${this._currentUser.user.firstname} ${this._currentUser.user.lastname}`;
    }

    login(payload: ILoginRequest): Observable<ILoginResponse> {
		return this.http.post<ILoginResponse>(`${this._apiUrl}/login`, payload);
    }
}
