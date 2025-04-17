import { ICoordinate } from '../interfaces/ICoordinate';
import { IMunro } from '../interfaces/IMunro';

export class Munro implements IMunro {
	id: string;
	hill_id: number;
	hill_list: string;
	hill_name: string;
	meaning: string;
	height: number;
	height_drop: number;
	latitude: number;
	longitude: number;
	os_ref: number;
	region_name: string;

	constructor(munro: Munro) {
		this.id = munro.id;
		this.hill_id = munro.hill_id;
		this.hill_list = munro.hill_list;
		this.hill_name = munro.hill_name;
		this.meaning = munro.meaning;
		this.height = munro.height;
		this.height_drop = munro.height_drop;
		this.latitude = munro.latitude;
		this.longitude = munro.longitude;
		this.os_ref = munro.os_ref;
		this.region_name = munro.region_name;
	}

	get coordinates(): ICoordinate {
		return { latitude: this.latitude, longitude: this.longitude };
	}
}

