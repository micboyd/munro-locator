export class BaseUser {
	id: string;
	firstname: string;
    lastname: string;
    username: string;

	constructor(init?: Partial<BaseUser>) {
		Object.assign(this, init);
	}
}
