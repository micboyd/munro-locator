import * as L from 'leaflet';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Munro } from '../../models/Munro';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css'],
	standalone: false,
})
export class MapComponent implements OnInit, OnChanges {
	@Input() incompleteMunros: Munro[] | null = null;
	@Input() completeMunros: Munro[] | null = null;

	private map: L.Map | undefined;
	private markers: L.Marker[] = [];

	constructor() {}

	ngOnInit(): void {
		this.initMap();
		this.addMunroMarkers();
	}

	ngOnChanges(changes: SimpleChanges): void {
		// Wait for map to be initialized
		if (this.map) {
			this.addMunroMarkers();
		}
	}

	private initMap(): void {
		this.map = L.map('map', {
			center: [56.8493796, -4.5336288],
			zoom: 8,
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
		if (this.incompleteMunros) {
			this.incompleteMunros.forEach(munro => {
				this.addMarker(munro, '#e91e63');
			});
		}
		if (this.completeMunros) {
			this.completeMunros.forEach(munro => {
				this.addMarker(munro, '#006400');
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

