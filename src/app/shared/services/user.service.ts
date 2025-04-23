import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class UserService {

        private apiUrl = `${environment.baseApiUrl}/user/`;

	constructor(private http: HttpClient) {}

	get userId(): string {
		return localStorage.getItem('id');
	}

	get fullName(): string {
		return localStorage.getItem('fullName');
	}

	get firstName(): string {
		return localStorage.getItem('firstName');
	}

	get lastName(): string {
		return localStorage.getItem('lastName');
	}

	get userName(): string {
		return localStorage.getItem('username');
	}

    getUsers(): Observable<Array<User>> {
        return this.http.get<Array<User>>(this.apiUrl);
    }

    getUser(userId: string): Observable<Array<User>> {
        return this.http.get<Array<User>>(`${this.apiUrl}/${userId}`);
    }

    updateUser(userId: string, user: User): Observable<User> {
        return this.http.put<User>(`${this.apiUrl}/${userId}`, user);
    }
}
