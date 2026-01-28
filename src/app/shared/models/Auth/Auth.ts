import { AuthResponse } from "./AuthResponse";

export class Auth {
    token: string;
    userId: string;

    constructor(response: AuthResponse) {
        this.token = response.token;
        this.userId = response.userId;
    }
}
