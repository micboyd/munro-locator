import { DashboardService } from './dashboard.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Munro } from 'src/models/munro';
import { User } from 'src/models/user';
import { GoogleMap } from '@angular/google-maps';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {

    @ViewChild(GoogleMap, { static: false }) map: GoogleMap

    // Map Options
    zoom = 8
    center: google.maps.LatLngLiteral
    options: google.maps.MapOptions = {
        zoomControl: false,
        disableDefaultUI: true,
    }
    marker: google.maps.Marker;
    currentUser = localStorage.getItem('userid');
    userDetails: User;
    completedMunros: Munro[];
    incompleteMunros: Munro[];
    selectedMunros: Munro[];
    totalMunros: number;
    completedMunrosLoaded = false;
    incompleteMunrosLoaded = false;
    currentUserLoaded = false;
    totalMunrosLoaded = false;
    showIncomplete = false;
    showMarker = false;
    markers = [];

    constructor(private dashboardService: DashboardService) { }

    ngOnInit(): void {
        this.getCurrentUser();
        this.getCompleteMunros();
        this.getIncompleteMunros();

        this.center = {
            lat: 57.0457984,
            lng: -3.6704677,
        }
    }

    munroToggle(switcher: boolean): void {
        if (switcher) {
            this.showIncomplete = true;
            this.selectedMunros = this.incompleteMunros;
        } else {
            this.showIncomplete = false;
            this.selectedMunros = this.completedMunros;
        }
    }

    getCurrentUser(): void {
        this.dashboardService.getUserDetails(this.currentUser).subscribe(
            (data) => {
                this.userDetails = data;
                this.currentUserLoaded = true;
            }
        );
    }

    getCompleteMunros(): void {
        this.dashboardService.getCompletedMunros(this.currentUser).subscribe(
            (data) => {
                this.completedMunros = data;
                this.selectedMunros = this.completedMunros;
                this.completedMunrosLoaded = true;
            }
        );
    }

    getIncompleteMunros(): void {
        this.dashboardService.getIncompleteMunros(this.currentUser).subscribe(
            (data) => {
                this.incompleteMunros = data;
                this.incompleteMunrosLoaded = true;
            }
        );
    }

    addMarker(lat: number, lng: number) {
        const element = document.querySelector("#map")
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
