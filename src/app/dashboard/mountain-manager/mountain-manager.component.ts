import { Component, OnInit } from '@angular/core';
import { MunroService } from '../../shared/services/munros.service';
import { Munro } from '../../shared/models/Munro';

@Component({
	selector: 'app-mountain-manager',
	templateUrl: './mountain-manager.component.html',
	standalone: false,
})
export class MountainManagerComponent implements OnInit {
	constructor(private munroService: MunroService) {}

	munrosLoading: boolean = false;
	private _munros: Array<Munro>;

	ngOnInit() {
		this.munrosLoading = true;
		this.munroService.getMunros().subscribe(data => {
			this._munros = data.map((munroData: Munro) => new Munro(munroData));
			this.munrosLoading = false;
		});
	}

	get allMunros(): Array<Munro> {
		return this._munros;
	}
}

