import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Mountain } from '../../models/Mountains/Mountain';
import { DriveResult, MapboxService } from '../../services/mapbox.service';

type State = 'loading' | 'success' | 'location-denied' | 'error';

@Component({
    selector: 'app-drive-time',
    templateUrl: './drive-time.component.html',
    standalone: false,
})
export class DriveTimeComponent implements OnInit {
    @Input() mountain!: Mountain;
    @Output() close = new EventEmitter<void>();

    state: State = 'loading';
    result: DriveResult | null = null;
    errorMessage = '';

    constructor(private mapboxService: MapboxService) {}

    ngOnInit(): void {
        this.mapboxService.getDriveTime({
            latitude: this.mountain.latitude,
            longitude: this.mountain.longitude,
        }).subscribe({
            next: (result) => {
                this.result = result;
                this.state = 'success';
            },
            error: (err: any) => {
                if (err?.code === 1) {
                    this.state = 'location-denied';
                } else {
                    this.errorMessage = 'Could not calculate the route.';
                    this.state = 'error';
                }
            },
        });
    }
}
