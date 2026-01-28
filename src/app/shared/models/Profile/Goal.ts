import { FormBuilder, FormGroup } from "@angular/forms";

import { GoalResponse } from "./GoalResponse";

export class Goal {
    id?: string;
    userId?: string;
    title?: string;
    description?: string;
    status?: "planned" | "training" | "in-progress" | "completed" | "abandoned";
    progressPercent?: number;
    completedAt?: Date;
    success?: boolean;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(response?: GoalResponse) {
        if (!response) return;

        this.id = response._id;
        this.userId = response.userId;
        this.title = response.title;
        this.description = response.description;
        this.status = response.status;
        this.progressPercent = response.progressPercent;
        this.completedAt = response.completedAt;
        this.success = response.success;
        this.createdAt = response.createdAt;
        this.updatedAt = response.updatedAt;
    }

    createForm(fb: FormBuilder): FormGroup {
        return fb.group({
            title: [this.title ?? ""],
            description: [this.description ?? ""],
            status: [this.status ?? "planned"],
            progressPercent: [this.progressPercent ?? 0],
            completedAt: [this.completedAt ?? null],
            success: [this.success ?? null],
        });
    }
}
