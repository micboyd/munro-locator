import { BaseUser } from "./BaseUser";
import { IUser } from "../interfaces/IUser";

export class User extends BaseUser implements IUser {
    profileImage: string;
    role?: string;

	constructor(init?: Partial<User>) {
		super(init);
		Object.assign(this, init);
	}
}
