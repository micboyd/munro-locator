import { FormBuilder, FormGroup } from "@angular/forms";

import { Mountain } from "../Mountains/Mountain";
import { PlannedMountainResponse } from "./PlannedMountainResponse";

export class PlannedMountain {
    userId: string;
    mountain: Mountain;
    plannedDate: Date;

    constructor(response: PlannedMountainResponse) {
        this.userId = response.userId;
        this.mountain = new Mountain(response.mountain);
        this.plannedDate = new Date(response.plannedDate);
    }

    createForm(fb: FormBuilder): FormGroup {
        return fb.group({
            userId: [this.userId ?? ""],
            mountainId: [this.mountain?._id ?? null],
            plannedDate: [this.plannedDate ?? null],
        });
    }
}
