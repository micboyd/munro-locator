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

	getMunros(): Observable<Array<Munro>> {
		return this.http.get<Array<Munro>>(this.apiUrl);
	}

	updatedUserCompletedMunros(munro: CompletedMunro): Observable<CompletedMunro> {
        const userId = this.userService.userId;
        return this.http.put<CompletedMunro>(this.apiUrl + `/${userId}/completed`, munro);
	}

    removeCompletedMunro(munroId: string): Observable<any> {
        const userId = this.userService.userId;
        return this.http.delete(this.apiUrl + `/${userId}/completed/${munroId}`);
      }

	getUserCompletedMunros(userId: string): Observable<Array<CompletedMunro>> {
		return this.http.get<Array<CompletedMunro>>(this.apiUrl + `/${userId}/completed`);
	}
}

