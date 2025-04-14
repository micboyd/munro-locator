import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
	providedIn: 'root',
})
export class MunroService {
	private apiUrl =  `${environment.baseApiUrl}/munros`;

	constructor(private http: HttpClient) {}

	getMunros(): Observable<any> {
		return this.http.get(this.apiUrl);
	}
}
