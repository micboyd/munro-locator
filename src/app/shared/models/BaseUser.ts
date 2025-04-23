export class BaseUser {
	id: number;
	firstname: string;
    lastname: string;
    username: string;

	constructor(init?: Partial<BaseUser>) {
		Object.assign(this, init);
	}
}
