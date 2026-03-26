import { Mountain } from '../Mountains/Mountain';
import { TripPlanResponse } from './TripPlanResponse';

export class TripPlan {
    _id: string;
    userId: string;
    title: string;
    description: string | null;
    startDate: Date | null;
    endDate: Date | null;
    mountains: Mountain[];
    createdAt: Date;
    updatedAt: Date;

    constructor(response: TripPlanResponse) {
        this._id = response._id;
        this.userId = response.userId;
        this.title = response.title;
        this.description = response.description ?? null;
        this.startDate = response.startDate ? new Date(response.startDate) : null;
        this.endDate = response.endDate ? new Date(response.endDate) : null;
        this.mountains = (response.mountains ?? []).map(m => new Mountain(m));
        this.createdAt = new Date(response.createdAt);
        this.updatedAt = new Date(response.updatedAt);
    }

    get isComplete(): boolean {
        return this.mountains.length > 0 && this.mountains.every(m => m.status === 'completed');
    }

    get completedCount(): number {
        return this.mountains.filter(m => m.status === 'completed').length;
    }
}
