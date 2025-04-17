import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Munro } from '../models/Munro';

@Injectable({
	providedIn: 'root',
})
export class MunroService {
	private apiUrl = `${environment.baseApiUrl}/munros`;

	constructor(private http: HttpClient) {}

	getMunros(): Observable<Array<Munro>> {
		return this.http.get<Array<Munro>>(this.apiUrl);
	}
}

