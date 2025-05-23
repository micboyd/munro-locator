import { FormBuilder, FormGroup } from '@angular/forms';

import { BaseUser } from './BaseUser';
import { CompletedMunro } from './CompletedMunro';
import { IUser } from '../interfaces/IUser';

export class User extends BaseUser implements IUser {
	userLoading: boolean = false;
	profileImage: string;
	bio: string;
	completedMunros: CompletedMunro[];

	constructor(init?: Partial<User>) {
		super(init);
		Object.assign(this, init);
	}

	createForm(fb: FormBuilder): FormGroup {
		return fb.group({
			firstname: [this.firstname || ''],
			lastname: [this.lastname || ''],
			bio: [this.bio || ''],
		});
	}
}

