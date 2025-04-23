import { Component, OnInit } from '@angular/core';

import { ICoordinate } from '../../shared/interfaces/ICoordinate';
import { MunroService } from '../../shared/services/munros.service';
import { Munro } from '../../shared/models/Munro';

@Component({
	selector: 'app-root',
	templateUrl: './locator.component.html',
	standalone: false,
})
export class LocatorComponent implements OnInit {
	title = 'munro-locator';

	private _munros: Array<Munro> = [];
	private _closestMunro: Munro | null = null;

	private _userCurrentLatitude: number = 0;
	private _userCurrentLongitude: number = 0;
	private _errorMessage: string = '';

	constructor(private munroService: MunroService) {}

	ngOnInit() {
		this.munroService.getMunros().subscribe(data => {
			this._munros = data.map((munroData: Munro) => new Munro(munroData));
		});

		this.getCurrentLocation();
	}

	get munros(): Array<Munro> {
		return this._munros;
	}

	get closestMunro(): Munro | null {
		return this._closestMunro;
	}

	get userCurrentCoordinates(): ICoordinate {
		return { latitude: this._userCurrentLatitude, longitude: this._userCurrentLongitude };
	}

	getClosestMunro() {
		const closestMunro = this.findClosestCoordinate(
			this.userCurrentCoordinates,
			this.munros.map(item => ({
				latitude: item.coordinates.latitude,
				longitude: item.coordinates.longitude,
			})),
		);

		const closestMunroObj = this.munros.find(
			munro =>
				munro.coordinates.latitude === closestMunro?.latitude &&
				munro.coordinates.longitude === closestMunro?.longitude,
		);

		if (closestMunroObj) {
			this._closestMunro = closestMunroObj;
		} else {
			this._closestMunro = null;
		}
	}

	private getCurrentLocation(): void {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				position => {
					this._userCurrentLatitude = position.coords.latitude;
					this._userCurrentLongitude = position.coords.longitude;
				},
				error => {
					this._errorMessage = `Error: ${error.message}`;
					console.error(this._errorMessage);
				},
			);
		} else {
			this._errorMessage = 'Geolocation is not supported by this browser.';
		}
	}

	private findClosestCoordinate(userCurrentCoordinates: ICoordinate, coordinates: Array<ICoordinate>) {
		let closestCoordinate = null;
		let minDistance = Infinity;

		for (const coord of coordinates) {
			const distance = this.haversine(
				userCurrentCoordinates.latitude,
				userCurrentCoordinates.longitude,
				coord.latitude,
				coord.longitude,
			);

			if (distance < minDistance) {
				minDistance = distance;
				closestCoordinate = coord;
			}
		}

		return closestCoordinate;
	}

	private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
		const earthRadius = 6371;

		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;

		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
				Math.cos((lat2 * Math.PI) / 180) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);

		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

		return earthRadius * c;
	}
}

