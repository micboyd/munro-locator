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
	userLoading: Subject<boolean> = new Subject<boolean>();

	private _currentUser = new BehaviorSubject<User | null>(null);
	currentUser$ = this._currentUser.asObservable(); // Exposed Observable

	private _apiUrl = `${environment.baseApiUrl}/user/`;

	constructor(private http: HttpClient) {}

	get userId(): string {
		return localStorage.getItem('id');
	}

	get currentUser(): User | null {
		return this._currentUser.value;
	}

	set currentUser(user: User | null) {
		this._currentUser.next(user);
	}

	get fullName(): string {
		return `${this._currentUser} + ${this._currentUser}`;
	}

	getUsers(): Observable<Array<User>> {
		return this.http.get<Array<User>>(this._apiUrl);
	}

	getUser(userId: string): Observable<User> {
		return this.http.get<User>(`${this._apiUrl}/${userId}`);
	}

	updateUser(userId: string, user: User): Observable<User> {
		return this.http.put<User>(`${this._apiUrl}/${userId}`, user);
	}

	updateProfilePicture(userId: string, formData: FormData): Observable<User> {
		return this.http.post<User>(`${this._apiUrl}/${userId}/image`, formData);
	}
}

