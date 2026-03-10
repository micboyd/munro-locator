import { FormBuilder, FormGroup } from "@angular/forms";

import { Mountain } from "../Mountains/Mountain";
import { PlannedMountainResponse } from "./PlannedMountainResponse";

export class PlannedMountain {
    _id: string;
    userId: string;
    mountain: Mountain;
    plannedDate: Date;

    constructor(response: PlannedMountainResponse) {
        this._id = response._id;
        this.userId = response.userId;
        this.mountain = new Mountain(response.mountain);
        this.plannedDate = new Date(response.plannedDate);
    }
}
