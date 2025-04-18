import { ICoordinate } from '../interfaces/ICoordinate';
import { IMunro } from '../interfaces/IMunro';
import { IUser } from '../interfaces/IUser';

export class User implements IUser {
	id: string;
	username: string;
	firstname: string;
	lastname: string;
	completedMunros: Array<string>;

	constructor(munro: IUser) {
		this.id = munro.id;
		this.username = munro.username;
		this.firstname = munro.firstname;
		this.lastname = munro.lastname;
		this.completedMunros = munro.completedMunros;
	}
}

