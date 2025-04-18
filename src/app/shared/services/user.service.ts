import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class UserService {
	constructor(http: HttpClient) {}

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

	addCompletedMunros;
}

