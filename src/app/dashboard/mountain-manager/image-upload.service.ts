import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  private _apiUrl = `${environment.baseApiUrl}/munros`;

  uploadFile(file: File, munroId: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', file, file.name);

    return this.http.post(`${this._apiUrl}/${munroId}/image`, formData, {
      headers: new HttpHeaders(),
    });
  }
}
