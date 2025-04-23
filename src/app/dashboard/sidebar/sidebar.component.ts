import { Component, OnInit } from '@angular/core';

import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/User';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	standalone: false,
})
export class SidebarComponent implements OnInit {
	constructor(public userService: UserService) {}

	private _currentUser: User = null;

	ngOnInit() {
		this.userService.currentUser$.subscribe(user => {
			this.currentUser = user;
		});
	}

	get currentUser() {
		return this._currentUser;
	}

	set currentUser(user: User) {
		this._currentUser = user;
	}
}

