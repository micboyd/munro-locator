import { Component, EventEmitter, Input, Output } from '@angular/core';

import { TripPlan } from '../../../shared/models/TripPlan/TripPlan';

@Component({
    selector: 'app-trip-plan-card',
    templateUrl: './trip-plan-card.component.html',
    standalone: false,
})
export class TripPlanCardComponent {
    @Input() trip!: TripPlan;
    @Output() view = new EventEmitter<TripPlan>();
    @Output() edit = new EventEmitter<TripPlan>();
    @Output() delete = new EventEmitter<string>();

    get dateRange(): string {
        if (this.trip.startDate && this.trip.endDate) {
            return `${this.formatDate(this.trip.startDate)} – ${this.formatDate(this.trip.endDate)}`;
        }
        if (this.trip.startDate) {
            return `From ${this.formatDate(this.trip.startDate)}`;
        }
        return 'No dates set';
    }

    private formatDate(date: Date): string {
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }
}
