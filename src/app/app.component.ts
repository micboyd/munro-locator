import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { User } from './shared/models/User';
import { UserService } from './shared/services/user.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	standalone: false,
})
export class AppComponent {

    constructor(private userService: UserService) {
        this.getCurrentUser();

        this.userService.userChanged.subscribe(() => {
            this.getCurrentUser();
        });

    }

    currentUser: User = new User();

    getCurrentUser() {
        this.userService.getUser(this.userService.userId).subscribe({
            next: (res: User) => {
                this.currentUser = new User(res);
                this.userService.currentUser = this.currentUser;
            },
            error: () => {
            },
        });
    }
}
