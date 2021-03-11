import { User } from './../../../models/user';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DashboardService } from './../dashboard.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    currentUser: string;
    userDetails: User;
    userDetailsLoaded = false;

    constructor(
        private dashboardService: DashboardService,
        private router: Router
    ) {}

    ngOnInit(): void {
        this.currentUser = localStorage.getItem('userid');
        this.getUserDetails(this.currentUser);
    }

    getUserDetails(userId: string): void {
        this.userDetailsLoaded = false;
        this.dashboardService.getUserDetails(userId).subscribe(
            (data: User) => {
                this.userDetails = data;
                this.userDetailsLoaded = true;
                console.log(data);
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    logout(): void {
        localStorage.clear();
        this.router.navigate(['login']);
    }

}
