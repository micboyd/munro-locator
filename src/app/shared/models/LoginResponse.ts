import { ILoginResponse } from '../shared/interfaces/ILoginResponse';

export class LoginResponse implements ILoginResponse {
	token: string;
	user: {
		id: number;
		username: string;
		firstname: string;
		lastname: string;
	};

	constructor(token: string, userId: number, username: string, firstname: string, lastname: string) {
		this.token = token;
		this.user = {
			id: userId,
			username: username,
			firstname: firstname,
			lastname: lastname,
		};
	}
}

