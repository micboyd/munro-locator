import * as L from 'leaflet';

import { Component, Input, OnInit } from '@angular/core';
import { Munro } from '../../models/Munro';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css'],
	standalone: false,
})
export class MapComponent implements OnInit {
	private map: L.Map | undefined;
	@Input() selectedMunro: Munro | null = null;

	constructor() {}

	ngOnInit(): void {
		this.initMap();
	}

	private initMap(): void {
		this.map = L.map('map', {
			center: [56.8493796, -4.5336288],
			zoom: 9,
			zoomControl: false,
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
	}
}

