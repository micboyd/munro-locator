import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Goal } from '../../../shared/models/Profile/Goal';
import { GoalRequest } from '../../../shared/models/Profile/GoalRequest';
import { ProfileService } from '../profile.service';

@Component({
    selector: 'app-goals',
    templateUrl: './goals.component.html',
    standalone: false,
})
export class GoalsComponent implements OnInit {

    goals: Goal[] = [];
    loading = false;
    saving = false;
    editMode = false;
    editingGoal: Goal | null = null;
    form!: FormGroup;

    constructor(
        private profileService: ProfileService,
        private authService: AuthenticationService,
        private fb: FormBuilder
    ) {}

    ngOnInit(): void {
        this.loadGoals();
    }

    get activeCount(): number {
        return this.goals.filter(g => g.status !== 'completed' && g.status !== 'abandoned').length;
    }

    get completedCount(): number {
        return this.goals.filter(g => g.status === 'completed').length;
    }

    get avgProgress(): number {
        if (!this.goals.length) return 0;
        const sum = this.goals.reduce((acc, g) => acc + (g.progressPercent ?? 0), 0);
        return Math.round(sum / this.goals.length);
    }

    loadGoals(): void {
        this.loading = true;
        this.profileService.getGoalsByUserId().subscribe({
            next: (goals) => {
                this.goals = goals;
                this.loading = false;
            },
            error: () => {
                this.loading = false;
            }
        });
    }

    addGoal(): void {
        this.editingGoal = null;
        this.form = new Goal().createForm(this.fb);
        this.editMode = true;
    }

    editGoal(goal: Goal): void {
        this.editingGoal = goal;
        this.form = goal.createForm(this.fb);
        this.editMode = true;
    }

    saveGoal(): void {
        if (this.form.invalid || this.saving) return;
        this.saving = true;

        const v = this.form.value;
        const request: Partial<GoalRequest> = {
            userId: this.authService.userId,
            title: v.title,
            description: v.description,
            status: v.status,
            progressPercent: +v.progressPercent,
        };

        if (v.completedAt) request.completedAt = v.completedAt;
        if (v.success != null) request.success = v.success;

        if (this.editingGoal?.id) {
            this.profileService.updateGoalById(this.editingGoal.id, request).subscribe({
                next: () => { this.onSaveSuccess(); },
                error: () => { this.saving = false; }
            });
        } else {
            this.profileService.createGoal(request as GoalRequest).subscribe({
                next: () => { this.onSaveSuccess(); },
                error: () => { this.saving = false; }
            });
        }
    }

    deleteGoal(id: string): void {
        this.profileService.deleteGoalById(id).subscribe(() => this.loadGoals());
    }

    cancel(): void {
        this.editMode = false;
        this.editingGoal = null;
    }

    statusBadgeClass(status: string): string {
        const map: Record<string, string> = {
            'planned':     'bg-neutral-100 text-neutral-600',
            'training':    'bg-blue-50 text-blue-700',
            'in-progress': 'bg-amber-50 text-amber-700',
            'completed':   'bg-[#708C69]/10 text-[#708C69]',
            'abandoned':   'bg-red-50 text-red-600',
        };
        return map[status] ?? 'bg-neutral-100 text-neutral-600';
    }

    statusLabel(status: string): string {
        const map: Record<string, string> = {
            'planned':     'Planned',
            'training':    'Training',
            'in-progress': 'In progress',
            'completed':   'Completed',
            'abandoned':   'Abandoned',
        };
        return map[status] ?? status;
    }

    progressBarClass(status: string): string {
        const map: Record<string, string> = {
            'completed': 'bg-[#708C69]',
            'abandoned': 'bg-red-400',
            'in-progress': 'bg-neutral-900',
        };
        return map[status] ?? 'bg-neutral-900';
    }

    private onSaveSuccess(): void {
        this.saving = false;
        this.editMode = false;
        this.editingGoal = null;
        this.loadGoals();
    }
}
