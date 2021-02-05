import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
    username: string;

    constructor(public router: Router) {}

    ngOnInit(): void {
        this.username = localStorage.getItem('username');
    }

    logout(): void {
        localStorage.clear();
        this.router.navigate(['login']);
    }
}
