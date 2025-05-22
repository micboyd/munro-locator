import * as L from 'leaflet';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Munro } from '../../models/Munro';
import { UserMunro } from '../../models/UserMunro';
import { ILocationSetting } from '../../interfaces/ILocationSetting';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css'],
	standalone: false,
})
export class MapComponent implements OnInit, OnChanges {
	@Input() allMunros: UserMunro[] | null = null;
	@Input() viewLocationSetting: ILocationSetting = {
		zoom: 8,
		center: {
			latitude: 56.8493796,
			longitude: -4.5336288,
		},
	};

	private map: L.Map | undefined;
	private markers: L.Marker[] = [];

	constructor() {}

	ngOnInit(): void {
		this.initMap();
		this.addMunroMarkers();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (this.map) {
			if (changes['viewLocationSetting'] && changes['viewLocationSetting'].currentValue) {
				// Get the new center and zoom
				const setting = changes['viewLocationSetting'].currentValue as ILocationSetting;
				this.map.setView([setting.center.latitude, setting.center.longitude], setting.zoom);
			}

			this.addMunroMarkers();
		}
	}

	private initMap(): void {
		this.map = L.map('map', {
			center: [this.viewLocationSetting.center.latitude, this.viewLocationSetting.center.longitude],
			zoom: this.viewLocationSetting.zoom,
			zoomControl: false,
		});
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
	}

	private addMunroMarkers(): void {
		if (!this.map) return;

		// Remove existing markers
		this.markers.forEach(marker => this.map!.removeLayer(marker));
		this.markers = [];

		// Otherwise, show all complete/incomplete Munros
		if (this.allMunros) {
			this.allMunros.forEach(munro => {
				this.addMarker(munro, munro.completed ? '#006400' : '#e91e63');
			});
		}
	}

	private addMarker(munro: Munro, color: string): void {
		if (munro.latitude && munro.longitude) {
			const marker = L.marker([munro.latitude, munro.longitude], {
				icon: this.createSvgCircleIcon(color),
			})
				.addTo(this.map!)
				.bindPopup(`<strong>${munro.hill_name}</strong>`);
			this.markers.push(marker);
		}
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
}

