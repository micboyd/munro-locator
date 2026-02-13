import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, map } from "rxjs";

import { Injectable } from "@angular/core";
import { Mountain } from "../../shared/models/Mountains/Mountain";
import { MountainRequest } from "../../shared/models/Mountains/MountainRequest";
import { MountainResponse } from "../../shared/models/Mountains/MountainResponse";
import { environment } from "../../../environments/environment";

@Injectable()
export class LibraryService {
    private readonly _apiUrl = environment.baseApiUrl;
    private readonly _mountainsUrl = `${this._apiUrl}/mountains/mountains`;

    constructor(private http: HttpClient) { }

    /**
     * GET /mountains?category=munro
     * Fetch all mountains (optionally filtered by category)
     */
    getAll(category?: string): Observable<Mountain[]> {
        let params = new HttpParams();
        if (category) params = params.set("category", category);

        return this.http
            .get<MountainResponse[]>(this._mountainsUrl, { params })
            .pipe(map((rows) => rows.map((r) => new Mountain(r))));
    }

    /**
     * POST /mountains
     * Create a mountain
     */
    create(request: MountainRequest): Observable<Mountain> {
        return this.http
            .post<MountainResponse>(this._mountainsUrl, request)
            .pipe(map((r) => new Mountain(r)));
    }

    /**
     * PUT /mountains/:id
     * Update mountain by Mongo _id
     *
     * Note:
     * Your backend supports partial updates (it filters allowed fields),
     * even though the route is PUT. So we accept Partial<MountainRequest>.
     */
    updateById(id: string, updates: Partial<MountainRequest>): Observable<Mountain> {
        return this.http
            .put<MountainResponse>(`${this._mountainsUrl}/${encodeURIComponent(id)}`, updates)
            .pipe(map((r) => new Mountain(r)));
    }

    /**
     * DELETE /mountains/:id
     * Delete mountain by Mongo _id
     */
    deleteById(id: string): Observable<{ message: string; id: string }> {
        return this.http.delete<{ message: string; id: string }>(
            `${this._mountainsUrl}/${encodeURIComponent(id)}`
        );
    }
}
