import * as L from 'leaflet';

import { Component, Input, OnInit } from '@angular/core';

import { Munro } from '../Munro';

@Component({
	selector: 'app-map',
	templateUrl: './map.component.html',
	styleUrls: ['./map.component.css'],
    standalone: false
})
export class MapComponent implements OnInit {
	private map: L.Map | undefined;
    @Input() selectedMunro: Munro | null = null;

	constructor() {}

	ngOnInit(): void {
		this.initMap();
	}

	private initMap(): void {

        if (this.selectedMunro) {

            this.map = L.map('map', {
                center: [
                    this.selectedMunro.coordinates.latitude,
                    this.selectedMunro.coordinates.longitude
                ],
                zoom: 10,
                zoomControl: false
            });

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

                var customIcon = L.icon({
                    iconUrl: 'https://static.thenounproject.com/png/17175-512.png',
                    iconSize: [40, 40],
                    popupAnchor: [0, -40]
                });

            // Add a marker at the map center
            L.marker(
                [
                    this.selectedMunro.coordinates.latitude,
                    this.selectedMunro.coordinates.longitude
                ],
                { icon: customIcon }
            ).addTo(this.map).bindPopup(`${this.selectedMunro.name}, ${this.selectedMunro.height}m high.`);
        }
    }
}
