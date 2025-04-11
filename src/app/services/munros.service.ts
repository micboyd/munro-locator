import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class MunroService {
	private apiUrl = 'https://munro-api-780f51427c56.herokuapp.com/api/munros';

	constructor(private http: HttpClient) {}

	getMunros(): Observable<any> {
		return this.http.get(this.apiUrl);
	}
}
