import { Observable, Subject } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class UserService {

    userChanged: Subject<void> = new Subject<void>();

    private _currentUser: User = null;
    private _apiUrl = `${environment.baseApiUrl}/user/`;

	constructor(private http: HttpClient) {}

    get userId(): string {
		return localStorage.getItem('id');
	}

    set currentUser(user: User) {
        this._currentUser = user;
    }

    get currentUser(): User {
        return this._currentUser;
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
        this.userChanged.next();
        return this.http.put<User>(`${this._apiUrl}/${userId}`, user);
    }

    updateProfilePicture(userId: string, formData: FormData): Observable<User> {
        this.userChanged.next();
        return this.http.post<User>(`${this._apiUrl}/${userId}/image`, formData);
    }
}
