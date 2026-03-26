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
    @Input() tripMountains: Mountain[] = [];   // already-in-trip, shown in green (no action)
    @Input() loading = false;
    @Input() popupActionLabel = 'View Details';

    @Output() close = new EventEmitter<void>();
    @Output() viewMountain = new EventEmitter<Mountain>();

    selectedCategory: string | null = null;

    private map?: L.Map;
    private markers: L.Marker[] = [];
    private boundsSet = false;

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

    get availableCategories(): string[] {
        const cats = new Set<string>();
        for (const mtn of this.mountains) {
            for (const c of (mtn.category ?? [])) cats.add(c);
        }
        return Array.from(cats).sort();
    }

    setCategory(cat: string | null): void {
        this.selectedCategory = cat;
        this.renderMountains();
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

        const valid = (mountains: Mountain[]) =>
            (mountains ?? []).filter(
                mtn => typeof mtn.latitude === 'number' && typeof mtn.longitude === 'number'
            );

        // Already-in-trip mountains — green, info popup only
        for (const mtn of valid(this.tripMountains)) {
            const color = mtn.status === 'completed' ? '#708C69' : '#9e9e9e';
            const marker = L.marker([mtn.latitude, mtn.longitude], {
                icon: this.createSvgCircleIcon(color),
            })
                .addTo(this.map)
                .bindPopup(this.buildInfoPopupHtml(mtn), { maxWidth: 320 });

            this.markers.push(marker);
        }

        // Selectable mountains — blue, with action button
        const selectable = valid(this.mountains).filter(mtn =>
            !this.selectedCategory || (mtn.category ?? []).includes(this.selectedCategory)
        );
        for (const mtn of selectable) {
            const marker = L.marker([mtn.latitude, mtn.longitude], {
                icon: this.createSvgCircleIcon('#1e88e5'),
            })
                .addTo(this.map)
                .bindPopup(this.buildPopupCardHtml(mtn), { maxWidth: 320 });

            marker.on('popupopen', () => {
                const btn = document.getElementById(`view-btn-${mtn._id}`) as HTMLButtonElement | null;
                if (!btn) return;
                btn.onclick = () => {
                    btn.innerHTML = '<i class="fa-solid fa-check text-xs mr-1.5"></i>Added';
                    btn.disabled = true;
                    btn.style.backgroundColor = '#708C69';
                    this.zone.run(() => this.viewMountain.emit(mtn));
                };
            });

            this.markers.push(marker);
        }

        if (!this.boundsSet) {
            const allValid = [...valid(this.tripMountains), ...selectable];
            if (allValid.length === 1) {
                this.map.setView([allValid[0].latitude, allValid[0].longitude], 12);
            } else if (allValid.length > 1) {
                const bounds = L.latLngBounds(allValid.map(mtn => [mtn.latitude, mtn.longitude]));
                this.map.fitBounds(bounds, { padding: [48, 48] });
            }
            this.boundsSet = true;
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

    private buildInfoPopupHtml(mtn: Mountain): string {
        const name = this.escapeHtml(mtn.name);
        const height = `${Math.round(mtn.height)} m`;
        const region = this.escapeHtml(mtn.region);
        const country = this.escapeHtml(mtn.country);

        const categories = (mtn.category || [])
            .map(c => this.categoryBadgeHtml(c))
            .join('');

        const statusBadge = mtn.status === 'completed'
            ? `<span class="inline-flex items-center gap-1 rounded-full bg-[#708C69] px-2.5 py-1 text-xs font-semibold text-white"><svg width="10" height="10" viewBox="0 0 10 10"><polyline points="1.5,5 4,7.5 8.5,2.5" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg> Summited</span>`
            : '';

        const imageBlock = mtn.imageUrl
            ? `<div class="h-28 w-full overflow-hidden rounded-t-2xl"><img src="${this.escapeHtml(mtn.imageUrl)}" alt="${name}" class="h-full w-full object-cover" /></div>`
            : '';

        return `
        <div class="w-[240px]">
            <div class="rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden">
            ${imageBlock}
            <div class="p-3 space-y-2">
                <div>
                <div class="text-sm font-semibold text-slate-900">${name}</div>
                <div class="text-xs text-slate-500">${region} · ${country}</div>
                </div>
                <div class="flex items-center justify-between">
                <div class="text-xs font-medium text-slate-600">${height}</div>
                <div class="flex flex-wrap gap-1">${categories}</div>
                </div>
                ${statusBadge}
            </div>
            </div>
        </div>
        `;
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
  ${this.escapeHtml(this.popupActionLabel)}
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
