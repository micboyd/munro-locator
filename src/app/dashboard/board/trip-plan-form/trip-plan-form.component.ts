import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { TripPlan } from '../../../shared/models/TripPlan/TripPlan';
import { TripPlanRequest, TripPlansService } from '../../../shared/services/trip-plans.service';

@Component({
    selector: 'app-trip-plan-form',
    templateUrl: './trip-plan-form.component.html',
    standalone: false,
})
export class TripPlanFormComponent implements OnInit {
    @Input() editingTrip: TripPlan | null = null;
    @Output() saved = new EventEmitter<TripPlan>();
    @Output() cancel = new EventEmitter<void>();

    form!: FormGroup;
    saving = false;

    constructor(
        private fb: FormBuilder,
        private tripPlansService: TripPlansService,
    ) {}

    ngOnInit(): void {
        this.form = this.fb.group({
            title: [this.editingTrip?.title ?? '', [Validators.required, Validators.maxLength(80)]],
            description: [this.editingTrip?.description ?? ''],
            dateRange: [{
                start: this.editingTrip?.startDate ? this.toInputDate(this.editingTrip.startDate) : '',
                end:   this.editingTrip?.endDate   ? this.toInputDate(this.editingTrip.endDate)   : '',
            }],
        });
    }

    save(): void {
        if (this.form.invalid || this.saving) return;
        this.saving = true;

        const v = this.form.value;
        const range = v.dateRange ?? {};
        const request: TripPlanRequest = {
            title: v.title.trim(),
            description: v.description?.trim() || null,
            startDate: range.start || null,
            endDate:   range.end   || null,
        };

        const op = this.editingTrip
            ? this.tripPlansService.update(this.editingTrip._id, request)
            : this.tripPlansService.create(request);

        op.subscribe({
            next: (trip) => {
                this.saving = false;
                this.saved.emit(trip);
            },
            error: () => {
                this.saving = false;
            },
        });
    }

    private toInputDate(date: Date): string {
        return date.toISOString().substring(0, 10);
    }
}
