import { Component, OnInit } from '@angular/core';

import { UserService } from '../../shared/services/user.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	standalone: false,
})
export class SidebarComponent implements OnInit {

	constructor(public userService: UserService) {}

	ngOnInit() {}

    get currentUser() {
        return this.userService.currentUser;
    }
}
