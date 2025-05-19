import * as L from 'leaflet';

import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { Munro } from '../../models/Munro';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css'],
	standalone: false,
})
export class MapComponent {
	@Input() munros: Munro[];
	@Input() singleMunro: Munro;

	private map: L.Map | undefined;
	private markers: L.Marker[] = [];

	constructor() {}

	// ngOnInit(): void {
	// 	this.initMap();
	// 	this.addMunroMarkers();
	// }

	// ngOnChanges(changes: SimpleChanges): void {
	// 	if (changes['munros'] && this.map) {
	// 		this.addMunroMarkers();
	// 	}
	// }

	private initMap(): void {
		this.map = L.map('map', {
			center: [56.8493796, -4.5336288],
			zoom: 8,
			zoomControl: false,
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
	}

	// private addMunroMarkers(): void {
	// 	if (!this.map) return;

	// 	this.markers.forEach(marker => this.map!.removeLayer(marker));
	// 	this.markers = [];

	// 	if (this.munros) {
	// 		this.munros.forEach(munro => {
	// 			const color = munro.completed ? '#006400' : '#e91e63';

	// 			if (munro.latitude && munro.longitude) {
	// 				const marker = L.marker([munro.latitude, munro.longitude], {
	// 					icon: this.createSvgCircleIcon(color),
	// 				})
	// 					.addTo(this.map)
	// 					.bindPopup(`
	//                         <strong>
	//                           <a href="#" routerLink="/mountain-manager/${munro._id}">
	//                             ${munro.hill_name}
	//                           </a>
	//                         </strong>
	//                       `);
	// 				this.markers.push(marker);
	// 			}
	// 		});
	// 	} else {
	// 		const color = this.singleMunro.completed ? '#006400' : '#e91e63';

	// 		if (this.singleMunro.latitude && this.singleMunro.longitude) {
	// 			const marker = L.marker([this.singleMunro.latitude, this.singleMunro.longitude], {
	// 				icon: this.createSvgCircleIcon(color),
	// 			})
	// 				.addTo(this.map)
	// 				.bindPopup(`<strong>${this.singleMunro.hill_name}</strong>`);
	// 			this.markers.push(marker);
	// 		}
	// 	}
	// }

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

