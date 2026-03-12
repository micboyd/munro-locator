import { Mountain } from './Mountain';

export class CompletedMountainResponse {
    _id: string;
    userId: string;
    mountainId: string;
    mountain?: Mountain;
    notes: string;
    dateCompleted: Date;
    rating: number;
    summitPhotos: string[];
}
