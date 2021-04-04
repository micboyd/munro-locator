import { DashboardService } from './dashboard.service';
import { Component, OnInit } from '@angular/core';
import { Munro } from 'src/models/munro';
import { User } from 'src/models/user';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})

export class DashboardComponent implements OnInit {

    // Map Options
    zoom = 8
    center: google.maps.LatLngLiteral
    options: google.maps.MapOptions = {
        zoomControl: false,
        scrollwheel: false,
        disableDefaultUI: true,
    }

    currentUser = localStorage.getItem('userid');

    userDetails: User;

    completedMunros: Munro[];
    incompleteMunros: Munro[];

    selectedMunros: Munro[];

    completedMunrosLoaded = false;
    incompleteMunrosLoaded = false;

    totalMunros: number;
    totalMunrosLoaded = false;

    showIncomplete = false;

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

    munroToggle(): void {
        this.showIncomplete = !this.showIncomplete;

        if (this.showIncomplete) {
            this.selectedMunros = this.incompleteMunros;
        } else {
            this.selectedMunros = this.completedMunros;
        }
    }

    getCurrentUser(): void {
        this.dashboardService.getUserDetails(this.currentUser).subscribe(
            (data) => {
                this.userDetails = data;
            }
        )
    }

    getCompleteMunros(): void {
        this.dashboardService.getCompletedMunros(this.currentUser).subscribe(
            (data) => {
                this.completedMunros = data;
                this.selectedMunros = this.completedMunros;
                this.completedMunrosLoaded = true;
            }
        )
    }

    getIncompleteMunros(): void {
        this.dashboardService.getIncompleteMunros(this.currentUser).subscribe(
            (data) => {
                this.incompleteMunros = data;
                this.incompleteMunrosLoaded = true;
            }
        )
    }
}
