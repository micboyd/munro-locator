import { DashboardService } from './dashboard.service';
import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

    currentUser: string;
    totalMunros: number;
    totalMunrosLoaded = false;

    constructor(private dashboardService: DashboardService) {}

    ngOnInit(): void {
        this.getTotalMunros();
    }

    getTotalMunros(): void {
        this.currentUser = localStorage.getItem('userid');
        this.dashboardService.getTotal(this.currentUser).subscribe((data) => {
            this.totalMunros = data.count;
            this.totalMunrosLoaded = true;
        });
    }
}
