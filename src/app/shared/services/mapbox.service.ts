import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface DriveResult {
    durationSeconds: number;
    distanceMeters: number;
    durationLabel: string;
    distanceLabel: string;
}

@Injectable({ providedIn: 'root' })
export class MapboxService {

    constructor(private http: HttpClient) {}

    getDriveTime(to: { latitude: number; longitude: number }): Observable<DriveResult> {
        return from(this.getCurrentPosition()).pipe(
            switchMap(pos => {
                const origin = `${pos.coords.longitude},${pos.coords.latitude}`;
                const dest   = `${to.longitude},${to.latitude}`;
                const url    = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin};${dest}`
                    + `?access_token=${environment.mapboxToken}&overview=false`;

                return this.http
                    .get<{ routes: { duration: number; distance: number }[] }>(url)
                    .pipe(
                        map(res => {
                            const route = res.routes[0];
                            return {
                                durationSeconds: route.duration,
                                distanceMeters:  route.distance,
                                durationLabel:   this.formatDuration(route.duration),
                                distanceLabel:   this.formatDistance(route.distance),
                            };
                        })
                    );
            })
        );
    }

    private getCurrentPosition(): Promise<GeolocationPosition> {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser.'));
                return;
            }
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }

    private formatDuration(seconds: number): string {
        const h = Math.floor(seconds / 3600);
        const m = Math.round((seconds % 3600) / 60);
        if (h === 0) return `${m} min`;
        if (m === 0) return `${h}h`;
        return `${h}h ${m}m`;
    }

    private formatDistance(meters: number): string {
        const miles = meters / 1609.344;
        return `${Math.round(miles)} miles`;
    }
}
