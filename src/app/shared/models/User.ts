import { BaseUser } from "./BaseUser";
import { CompletedMunro } from "./CompletedMunro";
import { IUser } from "../interfaces/IUser";

export class User extends BaseUser implements IUser {
    profileImage: string;
    bio: string;
    completedMunros: CompletedMunro[];

    get fullName(): string {
        return `${this.firstname} ${this.lastname}`;
    }

	constructor(init?: Partial<User>) {
		super(init);
		Object.assign(this, init);
	}
}
