import { Component, OnInit } from '@angular/core';

import { TripPlan } from '../../../shared/models/TripPlan/TripPlan';
import { TripPlansService } from '../../../shared/services/trip-plans.service';

@Component({
    selector: 'app-trip-plans',
    templateUrl: './trip-plans.component.html',
    standalone: false,
})
export class TripPlansComponent implements OnInit {

    trips: TripPlan[] = [];
    loading = false;

    viewingTrip: TripPlan | null = null;
    editingTrip: TripPlan | null = null;
    showForm = false;

    constructor(private tripPlansService: TripPlansService) {}

    ngOnInit(): void {
        this.load();
    }

    load(): void {
        this.loading = true;
        this.tripPlansService.getAll().subscribe({
            next: (trips) => {
                this.trips = trips;
                this.loading = false;
            },
            error: () => {
                this.trips = [];
                this.loading = false;
            },
        });
    }

    openCreate(): void {
        this.editingTrip = null;
        this.showForm = true;
    }

    openEdit(trip: TripPlan): void {
        this.editingTrip = trip;
        this.showForm = true;
    }

    onFormSaved(trip: TripPlan): void {
        this.showForm = false;
        this.editingTrip = null;
        this.load();
    }

    onFormCancel(): void {
        this.showForm = false;
        this.editingTrip = null;
    }

    openDetail(trip: TripPlan): void {
        this.viewingTrip = trip;
    }

    onDetailClose(): void {
        this.viewingTrip = null;
        this.load();
    }

    onDetailUpdated(trip: TripPlan): void {
        const idx = this.trips.findIndex(t => t._id === trip._id);
        if (idx !== -1) this.trips[idx] = trip;
    }

    deleteTrip(id: string): void {
        this.tripPlansService.delete(id).subscribe(() => this.load());
    }
}
