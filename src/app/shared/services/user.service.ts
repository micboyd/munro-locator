import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	userChanged: Subject<void> = new Subject<void>();

	private _userLoading: boolean = true;
	private _currentUser: User;

	private _apiUrl = `${environment.baseApiUrl}/user/`;

	constructor(private http: HttpClient) {}

	get userLoading(): boolean {
		return this._userLoading;
	}

	set userLoading(userLoading: boolean) {
		this._userLoading = userLoading;
	}

	get userId(): string {
		return localStorage.getItem('id');
	}

	get currentUser(): User {
		return this._currentUser;
	}

	set currentUser(user: User) {
		this._currentUser = user;
	}

	get fullName(): string {
		return `${this._currentUser.firstname} ${this._currentUser.lastname}`;
	}

	getUsers(): Observable<Array<User>> {
		return this.http.get<Array<User>>(this._apiUrl);
	}

	getUser(userId: string): Observable<User> {
		return this.http.get<User>(`${this._apiUrl}/${userId}`);
	}

	updateUser(userId: string, user: FormData): Observable<User> {
        console.log('User Service:', user);
		return this.http.put<User>(`${this._apiUrl}/${userId}`, user);
	}

	updateProfilePicture(userId: string, formData: FormData): Observable<User> {
		return this.http.post<User>(`${this._apiUrl}/${userId}/image`, formData);
	}
}

