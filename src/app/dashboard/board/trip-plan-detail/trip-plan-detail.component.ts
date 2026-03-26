import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { Mountain } from '../../../shared/models/Mountains/Mountain';
import { LibraryService } from '../../library/library.service';
import { TripPlan } from '../../../shared/models/TripPlan/TripPlan';
import { TripPlansService } from '../../../shared/services/trip-plans.service';

@Component({
    selector: 'app-trip-plan-detail',
    templateUrl: './trip-plan-detail.component.html',
    standalone: false,
    providers: [LibraryService],
})
export class TripPlanDetailComponent implements OnInit, OnDestroy {
    @Input() trip!: TripPlan;
    @Output() close = new EventEmitter<void>();
    @Output() updated = new EventEmitter<TripPlan>();

    searchTerm = '';
    searchResults: Mountain[] = [];
    searching = false;
    addingId: string | null = null;
    removingId: string | null = null;
    completingMountain: Mountain | null = null;

    showMapPicker = false;
    mapMountains: Mountain[] = [];
    mapLoading = false;

    constructor(
        private tripPlansService: TripPlansService,
        private libraryService: LibraryService,
    ) {}

    ngOnInit(): void {
        document.body.style.overflow = 'hidden';
    }

    ngOnDestroy(): void {
        document.body.style.overflow = '';
    }

    get dateRange(): string {
        if (this.trip.startDate && this.trip.endDate) {
            return `${this.fmt(this.trip.startDate)} – ${this.fmt(this.trip.endDate)}`;
        }
        if (this.trip.startDate) return `From ${this.fmt(this.trip.startDate)}`;
        return '';
    }

    private fmt(date: Date): string {
        return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    onSearch(): void {
        const term = this.searchTerm.trim();
        if (!term) {
            this.searchResults = [];
            return;
        }
        this.searching = true;
        const params = new HttpParams().set('search', term).set('limit', '6');
        this.libraryService.getAll(params).subscribe({
            next: (res) => {
                const inTrip = new Set(this.trip.mountains.map(m => m._id));
                this.searchResults = res.data.filter(m => !inTrip.has(m._id));
                this.searching = false;
            },
            error: () => { this.searching = false; },
        });
    }

    addMountain(mountain: Mountain): void {
        this.addingId = mountain._id;
        this.tripPlansService.addMountain(this.trip._id, mountain._id).subscribe({
            next: (updated) => {
                this.trip = updated;
                this.searchResults = this.searchResults.filter(m => m._id !== mountain._id);
                this.mapMountains = this.mapMountains.filter(m => m._id !== mountain._id);
                this.addingId = null;
                this.updated.emit(updated);
            },
            error: () => { this.addingId = null; },
        });
    }

    removeMountain(mountainId: string): void {
        this.removingId = mountainId;
        this.tripPlansService.removeMountain(this.trip._id, mountainId).subscribe({
            next: (updated) => {
                this.trip = updated;
                this.removingId = null;
                this.updated.emit(updated);
            },
            error: () => { this.removingId = null; },
        });
    }

    completeMountain(mountain: Mountain): void {
        this.completingMountain = mountain;
    }

    onCompleteSaved(): void {
        this.completingMountain = null;
        // Reload the trip so status updates are reflected
        this.tripPlansService.getById(this.trip._id).subscribe({
            next: (updated) => {
                this.trip = updated;
                this.updated.emit(updated);
            },
        });
    }

    clearSearch(): void {
        this.searchTerm = '';
        this.searchResults = [];
    }

    openMapPicker(): void {
        this.showMapPicker = true;
        this.mapLoading = true;
        const inTrip = new Set(this.trip.mountains.map(m => m._id));
        const params = new HttpParams().set('all', 'true');
        this.libraryService.getAll(params).subscribe({
            next: (res) => {
                this.mapMountains = res.data.filter(m => !inTrip.has(m._id));
                this.mapLoading = false;
            },
            error: () => { this.mapLoading = false; },
        });
    }

    onMapMountainSelected(mountain: Mountain): void {
        this.addMountain(mountain);
    }
}
