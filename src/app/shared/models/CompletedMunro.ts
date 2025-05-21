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

    createForm(fb: FormBuilder): FormGroup {
        return fb.group({
            munroId: [this.munroId || ''],
            notes: [this.notes || ''],
            rating: [this.rating || 0],
        });
    }
}

