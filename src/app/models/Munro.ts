import { ICoordinate } from '../interfaces/ICoordinate';
import { IMunro } from '../interfaces/IMunro';

export class Munro {
	private _name: string;
	private _height: number;
	private _latitude: number;
	private _longitude: number;
	private _hillbagging: string;

	constructor(munro: IMunro) {
		this._name = munro.name;
		this._height = munro.height;
		this._latitude = munro.latitude;
		this._longitude = munro.longitude;
		this._hillbagging = munro.hillbagging;
	}

	get name(): string {
		return this._name;
	}

	get height(): number {
		return this._height;
	}

	get hillbagging(): string {
		return this._hillbagging;
	}

	get coordinates(): ICoordinate {
		return {
			latitude: this._latitude,
			longitude: this._longitude,
		};
	}
}
