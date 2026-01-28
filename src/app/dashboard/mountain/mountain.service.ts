// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../environments/environment';

// // If you already have a shared Mountain model/interface, import it instead.
// export interface Mountain {
//     _id?: string;
//     name: string;
//     category: string;   // e.g. "munro"
//     country: string;
//     meaning?: string;
//     height: number;
//     latitude?: number;
//     longitude?: number;
//     region?: string;
//     imageUrl?: string;

//     createdAt?: string;
//     updatedAt?: string;
// }

// @Injectable()
// export class MountainService {
//     private readonly _apiUrl = environment.baseApiUrl;
//     private readonly _mountainsUrl = `${this._apiUrl}/mountains`;

//     constructor(private http: HttpClient) { }

//     /**
//      * GET /mountains?category=munro
//      * Fetch all mountains (optionally filtered by category)
//      */
//     getAll(category?: string): Observable<Mountain[]> {
//         let params = new HttpParams();

//         if (category) {
//             params = params.set('category', category);
//         }

//         return this.http.get<Mountain[]>(this._mountainsUrl, { params });
//     }

//     /**
//      * POST /mountains
//      * Create a mountain
//      */
//     create(request: Omit<Mountain, '_id' | 'createdAt' | 'updatedAt'>): Observable<Mountain> {
//         return this.http.post<Mountain>(this._mountainsUrl, request);
//     }

//     /**
//      * PUT /mountains/:id
//      * Update mountain by Mongo _id
//      * (Backend allows: name, category, country, meaning, height, latitude, longitude, region, imageUrl)
//      */
//     updateById(
//         id: string,
//         updates: Partial<Pick<
//             Mountain,
//             'name' | 'category' | 'country' | 'meaning' | 'height' | 'latitude' | 'longitude' | 'region' | 'imageUrl'
//         >>
//     ): Observable<Mountain> {
//         return this.http.put<Mountain>(`${this._mountainsUrl}/${encodeURIComponent(id)}`, updates);
//     }

//     /**
//      * DELETE /mountains/:id
//      * Delete mountain by Mongo _id
//      */
//     deleteById(id: string): Observable<{ message: string; id: string }> {
//         return this.http.delete<{ message: string; id: string }>(
//             `${this._mountainsUrl}/${encodeURIComponent(id)}`
//         );
//     }
// }
