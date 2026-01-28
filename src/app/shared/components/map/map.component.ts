// import * as L from 'leaflet';

// import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

// import { ILocationSetting } from '../../interfaces/ILocationSetting';
// import { Munro } from '../../models/Munro';
// import { UserMunro } from '../../models/UserMunro';

// @Component({
// 	selector: 'app-map',
// 	templateUrl: './map.component.html',
// 	styleUrls: ['./map.component.css'],
// 	standalone: false,
// })
// export class MapComponent implements OnInit, OnChanges {
// 	@Input() allMunros: Munro | UserMunro[] | null = null;

// 	@Input() viewLocationSetting: ILocationSetting = {
// 		zoom: 8,
// 		center: {
// 			latitude: 56.8493796,
// 			longitude: -4.5336288,
// 		},
// 	};

// 	private map: L.Map | undefined;
// 	private markers: L.Marker[] = [];

// 	ngOnInit(): void {
// 		this.initMap();
// 		this.addMunroMarkers();
// 	}

// 	ngOnChanges(changes: SimpleChanges): void {
// 		if (!this.map) return;

// 		if (changes['viewLocationSetting']?.currentValue) {
// 			const setting = changes['viewLocationSetting'].currentValue as ILocationSetting;
// 			this.map.setView([setting.center.latitude, setting.center.longitude], setting.zoom);
// 		}

// 		if (changes['allMunros']) {
// 			this.addMunroMarkers();
// 		}
// 	}

// 	private initMap(): void {
// 		this.map = L.map('map', {
// 			center: [this.viewLocationSetting.center.latitude, this.viewLocationSetting.center.longitude],
// 			zoom: this.viewLocationSetting.zoom,
// 			zoomControl: false,
// 		});

// 		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
// 	}

// 	private addMunroMarkers(): void {
// 		if (!this.map) return;

// 		// Remove existing markers
// 		this.markers.forEach(marker => this.map!.removeLayer(marker));
// 		this.markers = [];

// 		const munros = this.normalizeMunros(this.allMunros);

// 		munros.forEach(munro => {
// 			const color = this.getMarkerColor(munro);
// 			this.addMarker(munro, color);
// 		});
// 	}

// 	// Turns (Munro | UserMunro[] | null) into a Munro[] you can loop over
// 	private normalizeMunros(input: Munro | UserMunro[] | null): Munro[] {
// 		if (!input) return [];
// 		return Array.isArray(input) ? input : [input];
// 	}

// 	// Only UserMunro will have `completed`; plain Munro will default color
// 	private getMarkerColor(munro: Munro): string {
// 		if (this.isUserMunro(munro)) {
// 			return munro.completed ? '#006400' : '#e91e63';
// 		}
// 		return '#1e88e5'; // default for plain Munro
// 	}

// 	private isUserMunro(m: Munro): m is UserMunro {
// 		return 'completed' in m;
// 	}

// 	private addMarker(munro: Munro, color: string): void {
// 		if (munro.latitude && munro.longitude) {
// 			const marker = L.marker([munro.latitude, munro.longitude], {
// 				icon: this.createSvgCircleIcon(color),
// 			})
// 				.addTo(this.map!)
// 				.bindPopup(`<strong>${munro.hill_name}</strong>`);

// 			this.markers.push(marker);
// 		}
// 	}

// 	private createSvgCircleIcon(fillColor: string): L.DivIcon {
// 		const svg = `
//       <svg width="20" height="20" viewBox="0 0 20 20">
//         <circle cx="10" cy="10" r="6" fill="${fillColor}" stroke="#fff" stroke-width="2"/>
//       </svg>`;

// 		return L.divIcon({
// 			className: '',
// 			html: svg,
// 			iconAnchor: [10, 10],
// 			popupAnchor: [0, -10],
// 		});
// 	}
// }
