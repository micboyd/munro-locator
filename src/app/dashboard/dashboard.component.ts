import { Component, OnInit } from '@angular/core';

import { combineLatest, take } from 'rxjs';
import { UserService } from '../shared/services/user.service';
import { MunroService } from '../shared/services/munros.service';
import { User } from '../shared/models/User';
import { OpenMeteoResponse, WeatherService } from '../shared/services/weather.service';

type CardModel = {
	badgeDay: string;
	windLabel: string;
	cloudLabel: string;
	tempRange: string;
	rainTag: string;
	chillTag: string | null;
	visibilityTag: string;
};

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	standalone: false,
})
export class DashboardComponent implements OnInit {
	private _appLoading: boolean = true;

	loading = true;
	error: string | null = null;

	raw: OpenMeteoResponse | null = null;
	card: CardModel | null = null;

	showDetails = false;
	nextHours: Array<{ time: string; temp: number; wind: number; rainProb: number }> = [];

	constructor(private userService: UserService, private munroService: MunroService) {
		this.userService.userChanged.subscribe(() => {
			this.getCurrentUser();
		});
	}

	ngOnInit() {
		combineLatest([this.munroService.getMunros(), this.userService.getUser(this.userService.userId)]).subscribe(
			([allMunros, currentUser]) => {
				this.userService.currentUser = new User(currentUser);
				this.userService.userLoading = false;

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
				error: () => { },
			});
	}

	toggleDetails(): void {
		this.showDetails = !this.showDetails;
	}

}

