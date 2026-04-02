import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Mountain } from '../../models/Mountains/Mountain';
import { NaismithResult, NaismithService } from '../../services/naismith.service';
import { MapboxService } from '../../services/mapbox.service';

type State = 'loading' | 'success' | 'no-trailhead' | 'location-denied' | 'error';

@Component({
    selector: 'app-naismith',
    templateUrl: './naismith.component.html',
    standalone: false,
})
export class NaismithComponent implements OnInit {
    @Input() mountain!: Mountain;
    @Output() close = new EventEmitter<void>();

    state: State = 'loading';
    userElevation = 0;
    distanceKm = 0;
    result: NaismithResult | null = null;
    errorMessage = '';

    constructor(
        private naismithService: NaismithService,
        private mapboxService: MapboxService,
    ) {}

    ngOnInit(): void {
        if (!this.mountain.trailheadLatitude || !this.mountain.trailheadLongitude) {
            this.state = 'no-trailhead';
            return;
        }

        const trailhead = {
            latitude: this.mountain.trailheadLatitude,
            longitude: this.mountain.trailheadLongitude,
        };
        const summit = {
            latitude: this.mountain.latitude,
            longitude: this.mountain.longitude,
        };

        forkJoin({
            elevation: this.naismithService.getTrailheadElevation(trailhead.latitude, trailhead.longitude),
            walk: this.mapboxService.getWalkDistance(trailhead, summit),
        }).subscribe({
            next: ({ elevation, walk }) => {
                this.userElevation = Math.round(elevation);
                this.distanceKm = Math.round((walk.distanceMeters / 1000) * 10) / 10;
                this.state = 'success';
                this.recalculate();
            },
            error: () => {
                this.errorMessage = 'Could not calculate the walk distance.';
                this.state = 'error';
            },
        });
    }

    recalculate(): void {
        const ascent = Math.max(0, this.mountain.height - this.userElevation);
        this.result = this.naismithService.calculate(this.distanceKm, ascent, this.userElevation);
    }

    get ascent(): number {
        return Math.max(0, this.mountain.height - this.userElevation);
    }

    formatHours(hours: number): string {
        return this.naismithService.formatHours(hours);
    }
}
