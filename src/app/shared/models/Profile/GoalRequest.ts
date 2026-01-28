export class GoalRequest {
    userId: string;
    title: string;
    description: string;
    status: "planned" | "training" | "in-progress" | "completed" | "abandoned";
    progressPercent: number;
    completedAt: Date;
    success: boolean;

    constructor() {}
}
