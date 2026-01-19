import { Component, OnInit } from '@angular/core';
import { ICoordinate } from '../../shared/interfaces/ICoordinate';
import { Munro } from '../../shared/models/Munro';
import { MunroService } from '../../shared/services/munros.service';

@Component({
	selector: 'app-root',
	templateUrl: './locator.component.html',
	standalone: false,
})
export class LocatorComponent implements OnInit {
	title = 'munro-locator';

	// State
	private _munros: Munro[] = [];
	private _closestMunro: Munro | null = null;

	private _userCurrentLatitude: number | null = null;
	private _userCurrentLongitude: number | null = null;

	private _errorMessage = '';

	constructor(private munroService: MunroService) { }

	ngOnInit(): void {
		// Load munros (sync)
		this._munros = this.munroService.allMunros ?? [];

		// Get location (async) then compute closest
		this.getCurrentLocation();
	}

	// Public getters for template
	get munros(): Munro[] {
		return this._munros;
	}

	get closestMunro(): Munro | null {
		return this._closestMunro;
	}

	get errorMessage(): string {
		return this._errorMessage;
	}

	get hasUserLocation(): boolean {
		return this._userCurrentLatitude !== null && this._userCurrentLongitude !== null;
	}

	get userCurrentCoordinates(): ICoordinate | null {
		if (!this.hasUserLocation) return null;
		return { latitude: this._userCurrentLatitude!, longitude: this._userCurrentLongitude! };
	}

	/**
	 * Call this from a button if you want (it also runs automatically after geolocation resolves)
	 */
	getClosestMunro(): void {
		// Guard: location not ready
		const user = this.userCurrentCoordinates;
		if (!user) {
			this._errorMessage = 'User location not available yet.';
			this._closestMunro = null;
			return;
		}

		// Guard: munros not loaded
		if (!this._munros.length) {
			this._errorMessage = 'No Munros loaded.';
			this._closestMunro = null;
			return;
		}

		this._errorMessage = '';

		let closest: Munro | null = null;
		let minDistance = Infinity;

		for (const m of this._munros) {
			const lat = this.toNumber(m.latitude);
			const lon = this.toNumber(m.longitude);

			// Skip invalid coords
			if (lat === null || lon === null) continue;

			const d = this.haversine(user.latitude, user.longitude, lat, lon);

			if (d < minDistance) {
				minDistance = d;
				closest = m;
			}
		}

		this._closestMunro = closest;

		if (!closest) {
			this._errorMessage = 'Could not determine closest Munro (no valid coordinates found).';
		}
	}

	private getCurrentLocation(): void {
		if (!navigator.geolocation) {
			this._errorMessage = 'Geolocation is not supported by this browser.';
			return;
		}

		navigator.geolocation.getCurrentPosition(
			position => {
				this._userCurrentLatitude = position.coords.latitude;
				this._userCurrentLongitude = position.coords.longitude;

				// Auto-compute once we actually have coords
				this.getClosestMunro();
			},
			error => {
				this._errorMessage = `Error: ${error.message}`;
				console.error(this._errorMessage);
			},
			{
				enableHighAccuracy: true,
				timeout: 10000,
				maximumAge: 30000,
			},
		);
	}

	private toNumber(value: unknown): number | null {
		if (typeof value === 'number' && Number.isFinite(value)) return value;
		if (typeof value === 'string') {
			const n = Number(value);
			return Number.isFinite(n) ? n : null;
		}
		return null;
	}

	private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
		const earthRadiusKm = 6371;

		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
			Math.cos((lat2 * Math.PI) / 180) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return earthRadiusKm * c;
	}
}
