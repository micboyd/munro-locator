import { FormBuilder, FormGroup } from '@angular/forms';

export class CompletedMunro {
	id: string;
	munroId: string;
	dateCompleted?: Date;
	notes?: string;
	rating?: number;
	summitImage?: string;

	constructor(init?: Partial<CompletedMunro>) {
		Object.assign(this, init);
	}
}

