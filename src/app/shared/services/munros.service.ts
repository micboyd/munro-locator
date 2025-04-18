import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Munro } from '../models/Munro';
import { environment } from '../../../environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class MunroService {
	private apiUrl = `${environment.baseApiUrl}/munros`;

	constructor(private http: HttpClient) {}

	getMunros(): Observable<Array<Munro>> {
		return this.http.get<Array<Munro>>(this.apiUrl);
	}

	updatedUserCompletedMunros(userId: string, completedMunros: Array<string>): Observable<Array<string>> {
		return this.http.put<Array<string>>(this.apiUrl + `/${userId}/completed`, completedMunros);
	}

	getUserCompletedMunros(userId: string): Observable<Array<string>> {
		return this.http.get<Array<string>>(this.apiUrl + `/${userId}/completed`);
	}
}

