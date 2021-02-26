import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './../../../models/user';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    @Input() currentUser: User;
    completeActive = true;

    constructor(private router: Router) {}

    ngOnInit(): void {}

    linkActive(): void {
        this.completeActive = !this.completeActive;
    }

    logout(): void {
        localStorage.clear();
        this.router.navigate(['login']);
    }
}
