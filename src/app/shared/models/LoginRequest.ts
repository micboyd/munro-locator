import { ILoginRequest } from '../shared/interfaces/ILoginRequest';

export class LoginRequest implements ILoginRequest {
	username: string;
	password: string;

	constructor(username: string, password: string) {
		this.username = username;
		this.password = password;
	}
}

