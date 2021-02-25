import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    completeActive = true;

    constructor() {}

    ngOnInit(): void {}

    linkActive(): void {
        this.completeActive = !this.completeActive;
    }
}
