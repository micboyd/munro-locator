import { Component } from '@angular/core';

import { combineLatest, take } from 'rxjs';
import { UserService } from '../shared/services/user.service';
import { MunroService } from '../shared/services/munros.service';
import { User } from '../shared/models/User';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	standalone: false,
})
export class DashboardComponent {
	private _appLoading: boolean = true;

	constructor(private userService: UserService, private munroService: MunroService) {
		this.appInit();

		this.userService.userChanged.subscribe(() => {
			this.getCurrentUser();
		});
	}

	appInit() {
		combineLatest([this.munroService.getMunros(), this.userService.getUser(this.userService.userId)]).subscribe(
			([allMunros, currentUser]) => {
				this.userService.currentUser = new User(currentUser);
				this.userService.userLoading = false;
				this.userService.userLoaded.next();

				this.munroService.allMunros = allMunros;
				this.munroService.munrosLoading = false;
			},
		);
	}

	getCurrentUser() {
		this.userService
			.getUser(this.userService.userId)
			.pipe(take(1))
			.subscribe({
				next: (res: User) => {
					this.userService.currentUser = new User(res);
				},
				error: () => {},
			});
	}
}

