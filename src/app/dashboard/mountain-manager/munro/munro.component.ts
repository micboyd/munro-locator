import { Component, OnInit } from '@angular/core';

import { MunroService } from '../../../shared/services/munros.service';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../shared/services/user.service';
import { Munro } from '../../../shared/models/Munro';
import { CompletedMunro } from '../../../shared/models/CompletedMunro';

@Component({
	selector: 'app-munro',
	templateUrl: './munro.component.html',
	standalone: false,
})
export class MunroComponent implements OnInit {
	munroId: string | null = null;

	private _completedMunroLoading: boolean = true;
	private _selectedMunro: Munro;
	private _completedMunro: CompletedMunro;

	constructor(private userService: UserService, private munroService: MunroService, private route: ActivatedRoute) {}

	faChevronLeft = faChevronLeft;

	get completedMunroLoading(): boolean {
		return this._completedMunroLoading;
	}

	get selectedMunro(): Munro {
		return this._selectedMunro;
	}

	get completedMunro(): CompletedMunro {
		return this._completedMunro;
	}

	ngOnInit() {
		this._completedMunroLoading = true;
		this.munroId = this.route.snapshot.paramMap.get('id');
		this._selectedMunro = this.munroService.allMunros.find(item => item._id === this.munroId);

		console.log();

		this.munroService
			.getUserCompletedMunroSingle(this.userService.userId, this.munroId)
			.subscribe(completedMunro => {
				this._completedMunro = completedMunro;
				this._completedMunroLoading = false;
			});
	}
}

