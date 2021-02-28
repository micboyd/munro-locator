import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from './dashboard.service';
import { Munro } from './munro';
import { User } from './../../models/user';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    userid: string;
    currentUser: User;
    completeMunros: Munro[];
    incompleteMunros: Munro[];
    completeIsLoading = false;
    incompleteIsLoading = false;

    constructor(
        private router: Router,
        private dashboardService: DashboardService
    ) {}

    ngOnInit(): void {
        this.userid = localStorage.getItem('userid');
        this.getCurrentUser();
        this.getCompleteMunros();
        this.getIncompleteMunros();
    }

    getCurrentUser(): void {
        this.dashboardService.getUserDetails(this.userid).subscribe(
            (data: User) => {
                this.currentUser = data;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    getCompleteMunros(): void {
        this.completeIsLoading = true;
        this.dashboardService.getCompleteMunros(this.userid).subscribe(
            (data: Munro[]) => {
                this.completeMunros = data;
                this.completeIsLoading = false;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    getIncompleteMunros(): void {
        this.incompleteIsLoading = true;
        this.dashboardService.getIncompleteMunros(this.userid).subscribe(
            (data: Munro[]) => {
                this.incompleteMunros = data;
                this.incompleteIsLoading = false;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    logout(): void {
        localStorage.clear();
        this.router.navigate(['login']);
    }
}
