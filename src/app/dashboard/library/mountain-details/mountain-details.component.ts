import * as L from 'leaflet';

import { AfterViewInit, Component, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output } from '@angular/core';

import { Mountain } from '../../../shared/models/Mountains/Mountain';
import { DriveResult, MapboxService } from '../../../shared/services/mapbox.service';
import { PlannedMountainsService } from '../../../shared/services/planned-mountains.service';
import { ToastService } from '../../../shared/services/toast.service';

type DriveState = 'loading' | 'success' | 'location-denied' | 'error' | 'unavailable';
type ElevState  = 'loading' | 'success' | 'error';

@Component({
    selector: 'app-mountain-details',
    templateUrl: './mountain-details.component.html',
    standalone: false,
})
export class MountainDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
    @Input() mountain!: Mountain;
    @Input() isAdded = false;
    @Input() isCompleted = false;

    @Output() close = new EventEmitter<void>();
    @Output() added = new EventEmitter<Mountain>();

    adding = false;
    driveState: DriveState = 'loading';
    driveResult: DriveResult | null = null;

    elevState: ElevState = 'loading';
    elevPolylinePoints = '';
    elevSummitX = 0;
    elevSummitY = 0;
    elevMin = 0;
    elevGain = 0;

    private map?: L.Map;
    private marker?: L.Marker;

    constructor(
        private plannedMountainsService: PlannedMountainsService,
        private toastService: ToastService,
        private mapboxService: MapboxService,
        private zone: NgZone,
    ) {}

    ngOnInit(): void {
        if (!this.mountain?.latitude || !this.mountain?.longitude) {
            this.driveState = 'unavailable';
            return;
        }

        this.mapboxService.getDriveTime({
            latitude: this.mountain.latitude,
            longitude: this.mountain.longitude,
        }).subscribe({
            next: (result) => {
                this.driveResult = result;
                this.driveState = 'success';
            },
            error: (err: any) => {
                this.driveState = err?.code === 1 ? 'location-denied' : 'error';
            },
        });

        this.mapboxService.getElevationTransect(
            this.mountain.latitude,
            this.mountain.longitude,
        ).subscribe({
            next: (points) => {
                this.buildElevationSvg(points);
                this.elevState = 'success';
            },
            error: () => {
                this.elevState = 'error';
            },
        });
    }

    private buildElevationSvg(points: number[]): void {
        const W = 400, H = 110, padY = 10;
        const n = points.length;
        const min = Math.min(...points);
        const max = Math.max(...points);
        const range = max - min || 1;

        this.elevMin  = Math.round(min);
        this.elevGain = Math.round(max - min);

        const toX = (i: number) => (i / (n - 1)) * W;
        const toY = (el: number) => H - padY - ((el - min) / range) * (H - padY * 2);

        this.elevPolylinePoints = points.map((el, i) => `${toX(i).toFixed(1)},${toY(el).toFixed(1)}`).join(' ');

        const summitIdx = points.indexOf(max);
        this.elevSummitX = +toX(summitIdx).toFixed(1);
        this.elevSummitY = +toY(max).toFixed(1);
    }

    ngAfterViewInit(): void {
        queueMicrotask(() => this.initMap());
    }

    ngOnDestroy(): void {
        this.marker?.remove();
        this.map?.remove();
        this.map = undefined;
    }

    onClose(): void {
        this.close.emit();
    }

    addToBoard(): void {
        if (this.isAdded || this.isCompleted || this.adding) return;
        this.adding = true;
        this.plannedMountainsService.createPlannedMountain(this.mountain._id, new Date()).subscribe({
            next: () => {
                this.isAdded = true;
                this.adding = false;
                this.toastService.show(`${this.mountain.name} added to your planner!`);
                this.added.emit(this.mountain);
            },
            error: () => {
                this.adding = false;
            },
        });
    }

    private initMap(): void {
        if (!this.mountain?.latitude || !this.mountain?.longitude) return;

        this.map = L.map('mountain-detail-map', {
            center: [this.mountain.latitude, this.mountain.longitude],
            zoom: 13,
            zoomControl: true,
            scrollWheelZoom: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(this.map);

        const icon = L.divIcon({
            className: '',
            html: `<svg width="20" height="20" viewBox="0 0 20 20"><circle cx="10" cy="10" r="6" fill="#0A0A0A" stroke="#fff" stroke-width="2.5"/></svg>`,
            iconAnchor: [10, 10],
        });

        this.marker = L.marker([this.mountain.latitude, this.mountain.longitude], { icon })
            .addTo(this.map);
    }
}
