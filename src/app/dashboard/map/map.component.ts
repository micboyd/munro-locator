import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { DashboardService } from '../dashboard.service';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
    @ViewChild(GoogleMap, { static: false }) map: GoogleMap

    zoom = 8
    center: google.maps.LatLngLiteral
    options: google.maps.MapOptions = {
        zoomControl: false,
        disableDefaultUI: true,
    }
    marker: google.maps.Marker;
    showMarker = false;
    markers = [];

    constructor(private dashboardService: DashboardService) {
        this.dashboardService.munroLocation.subscribe(
            (data) => {
                this.addMarker(data.lat, data.lng);
            }
        );
    }

    ngOnInit(): void {
        this.center = {
            lat: 57.0457984,
            lng: -3.6704677,
        }
    }

    addMarker(lat: number, lng: number) {
        const element = document.querySelector("#map");
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });

        this.markers = [];

        this.markers.push({
            position: {
                lat: lat,
                lng: lng,
            }
        });

        this.zoom = 11;
        this.map.panTo({ lat: lat, lng: lng });
    }
}
