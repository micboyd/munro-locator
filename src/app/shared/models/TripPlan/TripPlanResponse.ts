import { MountainResponse } from '../Mountains/MountainResponse';

export class TripPlanResponse {
    _id: string;
    userId: string;
    title: string;
    description: string | null;
    startDate: string | null;
    endDate: string | null;
    mountains: MountainResponse[];
    createdAt: string;
    updatedAt: string;
}
