import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MunroService {

  private apiUrl = 'http://localhost:4200/filtered_munros.json';  // Example API endpoint

  constructor(private http: HttpClient) { }

    // Method to fetch data
    getMunros(): Observable<any> {
        return this.http.get(this.apiUrl);
    }
}
