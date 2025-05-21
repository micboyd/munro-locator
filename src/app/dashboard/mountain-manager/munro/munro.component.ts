import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, map, of } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { CompletedMunro } from '../../../shared/models/CompletedMunro';
import { FormGroup } from '@angular/forms';
import { Munro } from '../../../shared/models/Munro';
import { MunroService } from '../../../shared/services/munros.service';
import { UserService } from '../../../shared/services/user.service';
import { catchError } from 'rxjs/operators';

@Component({
	selector: 'app-munro',
	templateUrl: './munro.component.html',
	standalone: false,
})
export class MunroComponent implements OnInit {
	private _selectedMunro: Munro = null;
	private _completedMunro: CompletedMunro = null;

    completedMunroForm: FormGroup = null;
	munrosLoading: boolean = true;
	munroStatus$: Observable<{ munro: Munro; completedMunro: CompletedMunro | null }>;

	constructor(private munroService: MunroService, private route: ActivatedRoute) {}

	get selectedMunro(): Munro {
		return this._selectedMunro;
	}

	get completedMunro(): CompletedMunro {
		return this._completedMunro;
	}

	ngOnInit() {
		const id = this.route.snapshot.paramMap.get('id');
		this.getMunroDetails(id);
	}

	getMunroDetails(munroId: string) {
		const munro$ = this.munroService.getSingleMunro(munroId);
		const completedMunro$ = this.munroService.getUserCompletedMunroSingle(munroId).pipe(catchError(() => of(null)));

		this.munroStatus$ = combineLatest([munro$, completedMunro$]).pipe(
			map(([munro, completedMunro]) => ({ munro, completedMunro })),
		);

		this.munroStatus$.subscribe(result => {
			this.munrosLoading = false;
			this._selectedMunro = result.munro;
			this._completedMunro = result.completedMunro;
		});
	}

    // initForm() {
	// 	this.completedMunroForm = this.completedMunro.createForm(this.fb);
	// 	this.formInitilised = true;
	// }

	onRatingChanged(newRating: number) {
		console.log(newRating);
	}
}

