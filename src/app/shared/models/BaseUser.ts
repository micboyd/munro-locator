export class BaseUser {
	id: string;
	firstname: string;
	lastname: string;
	username: string;
	fullname: string;

	constructor(init?: Partial<BaseUser>) {
		Object.assign(this, init);
		this.fullname = `${this.firstname} ${this.lastname}`;
	}
}

