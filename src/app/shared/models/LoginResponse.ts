import { ILoginResponse } from '../interfaces/ILoginResponse';

export class LoginResponse implements ILoginResponse {
	token: string;
	user: {
		id: string;
		username: string;
		firstname: string;
		lastname: string;
	};

	constructor(token: string, userId: string, username: string, firstname: string, lastname: string) {
		this.token = token;
		this.user = {
			id: userId,
			username: username,
			firstname: firstname,
			lastname: lastname,
		};
	}
}

