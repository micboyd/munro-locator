import * as L from 'leaflet';

import {
    Component,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
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
    @Output() viewMountain = new EventEmitter<Mountain>(); // 🔥 new event

    private map?: L.Map;
    private markers: L.Marker[] = [];

    constructor(private zone: NgZone) { }

    ngOnInit(): void {
        queueMicrotask(() => {
            this.initMap();
            if (!this.loading) this.renderMountains();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.map) return;

        const loadingChanged = !!changes['loading'];
        const mountainsChanged = !!changes['mountains'];

        if (loadingChanged && this.loading === false) {
            this.renderMountains();
            return;
        }

        if (mountainsChanged && this.loading === false) {
            this.renderMountains();
        }

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
            zoom: 6,
            zoomControl: false,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
        }).addTo(this.map);
    }

    private renderMountains(): void {
        if (!this.map || this.loading) return;

        this.clearMarkers();

        const validMountains = (this.mountains ?? []).filter(
            mtn => typeof mtn.latitude === 'number' && typeof mtn.longitude === 'number'
        );

        for (const mtn of validMountains) {
            const marker = L.marker([mtn.latitude, mtn.longitude], {
                icon: this.createSvgCircleIcon('#1e88e5'),
            })
                .addTo(this.map)
                .bindPopup(this.buildPopupCardHtml(mtn), {
                    maxWidth: 320,
                });

            marker.on('popupopen', () => {
                const btn = document.getElementById(`view-btn-${mtn._id}`);
                if (!btn) return;

                btn.onclick = () => {
                    this.zone.run(() => {
                        this.viewMountain.emit(mtn);
                    });
                };
            });

            this.markers.push(marker);
        }

        if (validMountains.length === 1) {
            this.map.setView([validMountains[0].latitude, validMountains[0].longitude], 12);
        } else if (validMountains.length > 1) {
            const bounds = L.latLngBounds(validMountains.map(mtn => [mtn.latitude, mtn.longitude]));
            this.map.fitBounds(bounds, { padding: [48, 48] });
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

    private buildPopupCardHtml(mtn: Mountain): string {
        const name = this.escapeHtml(mtn.name);
        const height = `${Math.round(mtn.height)} m`;
        const region = this.escapeHtml(mtn.region);
        const country = this.escapeHtml(mtn.country);

        const categories = (mtn.category || [])
            .map(c => this.categoryBadgeHtml(c))
            .join('');

        const imageBlock = mtn.imageUrl
            ? `
            <div class="h-32 w-full overflow-hidden rounded-t-2xl">
            <img
                src="${this.escapeHtml(mtn.imageUrl)}"
                alt="${name}"
                class="h-full w-full object-cover"
            />
            </div>
        `
            : '';

        return `
        <div class="w-[280px]">
            <div class="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">

            ${imageBlock}

            <div class="p-4 space-y-3">
                <div>
                <div class="text-base font-semibold text-slate-900">${name}</div>
                <div class="text-xs text-slate-500">${region} • ${country}</div>
                </div>

                <div class="flex items-center justify-between">
                <div class="text-sm font-medium text-slate-700">${height}</div>
                <div class="flex flex-wrap gap-1">
                    ${categories}
                </div>
                </div>

<button
  id="view-btn-${mtn._id}"
  class="w-full px-5 py-3 rounded-full bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors duration-200 cursor-pointer"
>
  View Details
</button>

            </div>
            </div>
        </div>
        `;
    }

    private categoryBadgeHtml(category: string): string {
        const safe = this.escapeHtml(category);
        return `
      <span class="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
        ${safe}
      </span>
    `;
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
