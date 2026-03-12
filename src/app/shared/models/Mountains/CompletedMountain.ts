import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CompletedMountainResponse } from './CompletedMountainResponse';
import { Mountain } from './Mountain';

export class CompletedMountain {
    _id: string;
    userId: string;
    mountainId: string;
    mountain?: Mountain;
    notes: string;
    dateCompleted: Date;
    rating: number;
    summitPhotos: string[];

    constructor(response?: CompletedMountainResponse) {
        if (!response) return;
        this._id = response._id;
        this.userId = response.userId;
        this.mountainId = response.mountainId;
        this.mountain = response.mountain ? new Mountain(response.mountain) : undefined;
        this.notes = response.notes;
        this.dateCompleted = response.dateCompleted;
        this.rating = response.rating;
        this.summitPhotos = response.summitPhotos;
    }

    createForm(fb: FormBuilder): FormGroup {
        const toDateInput = (d: Date | undefined) =>
            d ? new Date(d).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];

        return fb.group({
            dateCompleted: [toDateInput(this.dateCompleted), Validators.required],
            notes: [this.notes ?? ''],
        });
    }
}
