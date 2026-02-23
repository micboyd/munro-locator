import { Component, HostListener, OnInit } from '@angular/core';

import { AuthenticationService } from '../shared/services/authentication.service';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	standalone: false,
})
export class DashboardComponent implements OnInit {
	constructor(public authService: AuthenticationService) { }

	ngOnInit() { }

	sidebarOpen = false;

	toggleSidebar(): void {
		this.sidebarOpen = !this.sidebarOpen;
	}

	closeSidebar(): void {
		this.sidebarOpen = false;
	}

	@HostListener('document:keydown.escape')
	onEscape(): void {
		this.closeSidebar();
	}
}

