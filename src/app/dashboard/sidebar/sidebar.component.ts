import { Component, OnInit } from '@angular/core';

import { User } from '../../shared/models/User';
import { UserService } from '../../shared/services/user.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	standalone: false,
})
export class SidebarComponent implements OnInit {

    selectedUser: User = null;

	constructor(public userService: UserService) {
        this.selectedUser = this.userService.currentUser;
        console.log(this.selectedUser);
    }

	mobileMenuOpen = false;

	closeMenu(): void {
		this.mobileMenuOpen = false;
	}

	toggleMenu(): void {
		this.mobileMenuOpen = !this.mobileMenuOpen;
	}
	ngOnInit() {}
}
