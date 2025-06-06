import { Component, OnInit } from '@angular/core';

import { User } from '../../shared/models/User';
import { UserService } from '../../shared/services/user.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	standalone: false,
})
export class SidebarComponent implements OnInit {
	constructor(public userService: UserService) {}

	isMenuOpen = false;

	ngOnInit() {}
}

