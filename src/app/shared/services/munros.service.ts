import { Observable, Subject } from 'rxjs';

import { CompletedMunro } from '../models/CompletedMunro';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Munro } from '../models/Munro';
import { UserService } from './user.service';
import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class MunroService {
	private apiUrl = `${environment.baseApiUrl}/munros`;

	constructor(private http: HttpClient, private userService: UserService) {}

	private _munrosLoading: boolean = true;

	private _allMunros: Array<Munro> = [];
	private _completedMunros: Array<Munro> = [];
	private _uncompletedMunros: Array<Munro> = [];
	private _userCompletedMunros: Array<CompletedMunro> = [];

	get munrosLoading(): boolean {
		return this._munrosLoading;
	}

	set munrosLoading(munrosLoading: boolean) {
		this._munrosLoading = munrosLoading;
	}

	get allMunros(): Array<Munro> {
		return this._allMunros;
	}

	set allMunros(value: Array<Munro>) {
		this._allMunros = value;
	}

	get completedMunros(): Array<Munro> {
		return this._completedMunros;
	}

	set completedMunros(value: Array<Munro>) {
		this._completedMunros = value;
	}

	get uncompletedMunros(): Array<Munro> {
		return this._uncompletedMunros;
	}

	set uncompletedMunros(value: Array<Munro>) {
		this._uncompletedMunros = value;
	}

	get userCompletedMunros(): Array<CompletedMunro> {
		return this._userCompletedMunros;
	}

	set userCompletedMunros(value: Array<CompletedMunro>) {
		this._userCompletedMunros = value;
	}

	getMunros(): Observable<Array<Munro>> {
		return this.http.get<Array<Munro>>(this.apiUrl);
	}

	getSingleMunro(munroId: string): Observable<Munro> {
		return this.http.get<Munro>(this.apiUrl + `/${munroId}`);
	}

	getUserCompletedMunros(): Observable<Array<CompletedMunro>> {
		return this.http.get<Array<CompletedMunro>>(this.apiUrl + `/users/${this.userService.userId}/completed`);
	}

	getUserCompletedMunroSingle(hillId: string): Observable<CompletedMunro> {
		return this.http.get<CompletedMunro>(this.apiUrl + `/users/${this.userService.userId}/completed/${hillId}`);
	}

	addUserCompletedMunroSingle(munro: CompletedMunro): Observable<CompletedMunro> {
		return this.http.post<CompletedMunro>(this.apiUrl + `/users/${this.userService.userId}/completed`, munro);
	}

	updatedUserCompletedMunro(munro: CompletedMunro): Observable<CompletedMunro> {
		return this.http.put<CompletedMunro>(this.apiUrl + `/users/${this.userService.userId}/completed`, munro);
	}

	removeCompletedMunro(munroId: string): Observable<any> {
		return this.http.delete(this.apiUrl + `/users/${this.userService.userId}/completed/${munroId}`);
	}
}

