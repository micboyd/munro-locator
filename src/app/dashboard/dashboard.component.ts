import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { Munro } from './munro';
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    username: string;
    userid: string;
    completeMunros: Munro[];
    incompleteMunros: Munro[];
    isLoading = false;

    constructor(
        private router: Router,
        private dashboardService: DashboardService
    ) {}

    ngOnInit(): void {
        this.username = localStorage.getItem('username');
        this.userid = localStorage.getItem('userid');
        this.getCompleteMunros();
        this.getIncompleteMunros();
    }

    getCompleteMunros(): void {
        this.dashboardService.getCompleteMunros(this.userid).subscribe(
            (data: Munro[]) => {
                this.completeMunros = data;
                this.isLoading = false;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    getIncompleteMunros(): void {
        this.dashboardService.getIncompleteMunros(this.userid).subscribe(
            (data: Munro[]) => {
                this.incompleteMunros = data;
                this.isLoading = false;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    updateMunroStatus(event, item): void {
        console.log(event.target.checked, item);
    }

    logout(): void {
        localStorage.clear();
        this.router.navigate(['login']);
    }
}
