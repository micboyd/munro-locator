import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export type OpenMeteoResponse = {
    timezone: string;
    hourly: {
        time: string[];
        temperature_2m: number[];
        wind_speed_10m: number[];              // km/h by default
        cloud_cover: number[];                 // %
        visibility: number[];                  // meters
        precipitation_probability: number[];    // %
        precipitation: number[];               // mm
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