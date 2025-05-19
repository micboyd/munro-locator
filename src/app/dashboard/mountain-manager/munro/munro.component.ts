import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CompletedMunro } from '../../../shared/models/CompletedMunro';
import { Munro } from '../../../shared/models/Munro';
import { MunroService } from '../../../shared/services/munros.service';
import { UserService } from '../../../shared/services/user.service';

@Component({
	selector: 'app-munro',
	templateUrl: './munro.component.html',
	standalone: false,
})
export class MunroComponent implements OnInit {
	private _selectedMunro: Munro = null;
	isEditing = false;

	constructor(private userService: UserService, private munroService: MunroService, private route: ActivatedRoute) {}

	get selectedMunro(): Munro {
		return this._selectedMunro;
	}

	ngOnInit() {
		const id = this.route.snapshot.paramMap.get('id');

		this.munroService.getSingleMunro(id).subscribe(munroDetails => {
			console.log(munroDetails);
		});

		this.munroService.getUserCompletedMunroSingle(id).subscribe(completedMunro => {
			console.log(completedMunro);
		});
	}
}

