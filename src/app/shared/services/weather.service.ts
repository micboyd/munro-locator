import { Observable, map } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export type OpenMeteoResponse = {
    timezone: string;
    hourly: {
        time: string[];
        temperature_2m: number[];
        wind_speed_10m: number[];
        cloud_cover: number[];
        visibility: number[];
        precipitation_probability: number[];
        precipitation: number[];
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        precipitation_sum: number[];
    };
};

@Injectable({ providedIn: 'root' })
export class WeatherService {

    constructor(private http: HttpClient) { }

    getForecast(lat: number, lon: number): Observable<OpenMeteoResponse> {
        const url =
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${lat}` +
            `&longitude=${lon}` +
            `&hourly=temperature_2m,wind_speed_10m,cloud_cover,visibility,precipitation_probability,precipitation` +
            `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum` +
            `&timezone=Europe%2FLondon`;

        return this.http.get<OpenMeteoResponse>(url);
    }
}
