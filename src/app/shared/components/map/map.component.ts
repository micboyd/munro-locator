import * as L from 'leaflet';
import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from '@angular/core';
import { Mountain } from '../../models/Mountains/Mountain';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css'],
    standalone: false,
})
export class MapComponent implements OnInit, OnChanges, OnDestroy {
    @Input() mountains: Mountain[] = [];
    @Input() loading = false;

    @Output() close = new EventEmitter<void>();

    private map?: L.Map;
    private markers: L.Marker[] = [];

    ngOnInit(): void {
        queueMicrotask(() => {
            this.initMap();
            // Only render if not loading
            if (!this.loading) this.renderMountains();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.map) return;

        const loadingChanged = !!changes['loading'];
        const mountainsChanged = !!changes['mountains'];

        // If we just finished loading, render (even if mountains didn't "change" ref)
        if (loadingChanged && this.loading === false) {
            this.renderMountains();
            return;
        }

        // If mountains changed while not loading, render
        if (mountainsChanged && this.loading === false) {
            this.renderMountains();
        }

        // If loading became true, clear markers so you don't show stale dots
        if (loadingChanged && this.loading === true) {
            this.clearMarkers();
        }
    }

    ngOnDestroy(): void {
        this.clearMarkers();
        this.map?.remove();
        this.map = undefined;
    }

    onClose(): void {
        this.close.emit();
    }

    private initMap(): void {
        if (this.map) return;

        this.map = L.map('map-fullscreen', {
            center: [56.8493796, -4.5336288],
            zoom: 8,
            zoomControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(this.map);
    }

    private renderMountains(): void {
        if (!this.map) return;
        if (this.loading) return;

        this.clearMarkers();

        const points: L.LatLngExpression[] = [];

        for (const mtn of this.mountains ?? []) {
            if (typeof mtn.latitude !== 'number' || typeof mtn.longitude !== 'number') continue;

            const latlng: L.LatLngExpression = [mtn.latitude, mtn.longitude];
            points.push(latlng);

            const marker = L.marker(latlng, {
                icon: this.createSvgCircleIcon('#1e88e5'),
            })
                .addTo(this.map)
                .bindPopup(`<strong>${this.escapeHtml(mtn.name)}</strong>`);

            this.markers.push(marker);
        }

        // Fit bounds nicely if we have points
        if (points.length) {
            const bounds = L.latLngBounds(points as any);
            this.map.fitBounds(bounds, { padding: [40, 40] });
        }
    }

    private clearMarkers(): void {
        for (const m of this.markers) m.remove();
        this.markers = [];
    }

    private createSvgCircleIcon(fillColor: string): L.DivIcon {
        const svg = `
      <svg width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="6" fill="${fillColor}" stroke="#fff" stroke-width="2"/>
      </svg>`;

        return L.divIcon({
            className: '',
            html: svg,
            iconAnchor: [10, 10],
            popupAnchor: [0, -10],
        });
    }

    private escapeHtml(text: string): string {
        return (text ?? '').replace(/[&<>"']/g, (ch) => {
            switch (ch) {
                case '&': return '&amp;';
                case '<': return '&lt;';
                case '>': return '&gt;';
                case '"': return '&quot;';
                case "'": return '&#39;';
                default: return ch;
            }
        });
    }
}
