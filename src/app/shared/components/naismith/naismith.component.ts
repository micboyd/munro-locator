import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mountain } from '../../models/Mountains/Mountain';
import { NaismithResult, NaismithService } from '../../services/naismith.service';

type State = 'loading' | 'success' | 'location-denied' | 'error';

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
    distanceKm = 10;
    result: NaismithResult | null = null;
    errorMessage = '';

    constructor(private naismithService: NaismithService) {}

    ngOnInit(): void {
        this.naismithService.getUserElevation().subscribe({
            next: (elevation) => {
                this.userElevation = Math.round(elevation);
                this.state = 'success';
                this.recalculate();
            },
            error: (err: any) => {
                if (err?.code === 1) {
                    this.state = 'location-denied';
                } else {
                    this.errorMessage = 'Could not get your location.';
                    this.state = 'error';
                }
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
