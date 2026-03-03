import { CompletedMountainResponse } from "./CompletedMountainResponse";

export class CompletedMountain {
    mountainId: string;
    notes: string;
    dateCompleted: Date;
    rating: number;
    summitPhotos: string[];

    constructor(response: CompletedMountainResponse) {
        this.mountainId = response.mountainId;
        this.notes = response.notes;
        this.dateCompleted = response.dateCompleted;
        this.rating = response.rating;
        this.summitPhotos = response.summitPhotos;
    }
}