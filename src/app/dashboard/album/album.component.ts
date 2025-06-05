import { Component, OnInit } from '@angular/core';

import { MunroService } from '../../shared/services/munros.service';
import { CompletedMunro } from '../../shared/models/CompletedMunro';

@Component({
	selector: 'app-root',
	templateUrl: './album.component.html',
	standalone: false,
})
export class AlbumComponent implements OnInit {
	completedMunros: Array<CompletedMunro> = [];
	completedMunrosLoading = true;
	imageUrls: string[] = [];

	constructor(private munroService: MunroService) {}

	ngOnInit() {
		this.getAllCompletedMunros();
	}

	getAllCompletedMunros() {
		this.munroService.getUserCompletedMunros().subscribe(data => {
			this.completedMunrosLoading = false;
			this.completedMunros = data;
			this.imageUrls = this.completedMunros.flatMap(c => c.summitImages);
		});
	}
}

