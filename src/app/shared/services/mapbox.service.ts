import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, of, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Coords {
    latitude: number;
    longitude: number;
}

export interface DriveResult {
    durationSeconds: number;
    distanceMeters: number;
    durationLabel: string;
    distanceLabel: string;
}

@Injectable({ providedIn: 'root' })
export class MapboxService {

    constructor(private http: HttpClient) {}

    getDriveTime(to: Coords): Observable<DriveResult> {
        return this.getDirections('driving', to);
    }

    getWalkDistance(from: Coords, to: Coords): Observable<DriveResult> {
        return this.getDirectionsFromCoords('walking', from, to);
    }

    private getDirections(profile: 'driving' | 'walking', to: Coords): Observable<DriveResult> {
        return from(this.getCurrentPosition()).pipe(
            switchMap(pos => {
                const origin: Coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
                return this.getDirectionsFromCoords(profile, origin, to);
            })
        );
    }

    private getDirectionsFromCoords(profile: 'driving' | 'walking', origin: Coords, dest: Coords): Observable<DriveResult> {
        const originStr = `${origin.longitude},${origin.latitude}`;
        const destStr   = `${dest.longitude},${dest.latitude}`;
        const url       = `https://api.mapbox.com/directions/v5/mapbox/${profile}/${originStr};${destStr}`
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

    getElevationTransect(lat: number, lon: number, numPoints = 25): Observable<number[]> {
        const spread = 0.06; // ~±3.3 km on each side
        const lats = Array.from({ length: numPoints }, (_, i) =>
            (lat + ((i / (numPoints - 1)) - 0.5) * spread).toFixed(6)
        );
        const lons = Array.from({ length: numPoints }, () => lon.toFixed(6));

        return this.http
            .get<{ elevation: number[] }>(
                `https://api.open-meteo.com/v1/elevation?latitude=${lats.join(',')}&longitude=${lons.join(',')}`
            )
            .pipe(map(res => res.elevation));
    }
}
