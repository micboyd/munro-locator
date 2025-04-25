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

	ngOnInit() {}
}

