import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/user';
import { DashboardService } from '../../dashboard.service';

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
    userDetails: User;
    userDetailsLoaded = false;

    constructor(private dashboardService: DashboardService) {}

    ngOnInit(): void {
        this.getCurrentUser();
    }

    getCurrentUser(): void {
        this.dashboardService
            .getUserDetails(this.dashboardService.currentUser)
            .subscribe((data) => {
                this.userDetails = data;
                this.userDetailsLoaded = true;
            });
    }
}
