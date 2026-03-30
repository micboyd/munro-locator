import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, from, switchMap, map } from 'rxjs';

export interface NaismithResult {
    distanceKm: number;
    ascentM: number;
    userElevationM: number;
    totalHours: number;
    walkingHours: number;
    climbingHours: number;
    label: string;
}

@Injectable({ providedIn: 'root' })
export class NaismithService {

    constructor(private http: HttpClient) {}

    getUserElevation(): Observable<number> {
        return from(this.getCurrentPosition()).pipe(
            switchMap(pos => {
                const lat = pos.coords.latitude.toFixed(6);
                const lng = pos.coords.longitude.toFixed(6);
                return this.http
                    .get<{ elevation: number[] }>(
                        `https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`
                    )
                    .pipe(map(res => res.elevation[0]));
            })
        );
    }

    calculate(distanceKm: number, ascentM: number, userElevationM = 0): NaismithResult {
        const walkingHours = distanceKm / 5;
        const climbingHours = ascentM / 600;
        const totalHours = walkingHours + climbingHours;
        return {
            distanceKm,
            ascentM,
            userElevationM,
            totalHours,
            walkingHours,
            climbingHours,
            label: this.formatHours(totalHours),
        };
    }

    formatHours(hours: number): string {
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        if (h === 0) return `${m} min`;
        if (m === 0) return `${h}h`;
        return `${h}h ${m}m`;
    }

    private getCurrentPosition(): Promise<GeolocationPosition> {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation not supported'));
                return;
            }
            navigator.geolocation.getCurrentPosition(resolve, reject);
        });
    }
}
