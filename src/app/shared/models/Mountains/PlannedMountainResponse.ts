import { Mountain } from "./Mountain";

export class PlannedMountainResponse {
    _id: string;
    userId: string;
    mountain: Mountain;
    plannedDate: Date;
}
