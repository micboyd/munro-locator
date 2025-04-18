import { ICoordinate } from '../interfaces/ICoordinate';
import { IMunro } from '../interfaces/IMunro';
import { IUser } from '../interfaces/IUser';

export class User implements IUser {
	id: string;
	username: string;
	firstname: string;
	lastname: string;
	password: string;
	completedMunros: Array<string>;

	constructor(user: IUser) {
		this.id = user.id;
		this.username = user.username;
		this.firstname = user.firstname;
		this.lastname = user.lastname;
		this.password = user.password;
		this.completedMunros = user.completedMunros;
	}
}

