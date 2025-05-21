import { Component, OnInit } from '@angular/core';
import { Observable, combineLatest, map, of } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { CompletedMunro } from '../../../shared/models/CompletedMunro';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Munro } from '../../../shared/models/Munro';
import { MunroService } from '../../../shared/services/munros.service';
import { UserService } from '../../../shared/services/user.service';
import { catchError, take } from 'rxjs/operators';

@Component({
	selector: 'app-munro',
	templateUrl: './munro.component.html',
	standalone: false,
})
export class MunroComponent implements OnInit {
	private _selectedMunro: Munro = null;
	private _completedMunro: CompletedMunro = null;

	completedMunroForm: FormGroup = null;
	munroLoading: boolean = true;
	munroStatus$: Observable<{ munro: Munro; completedMunro: CompletedMunro | null }>;

	constructor(public fb: FormBuilder, private munroService: MunroService, private route: ActivatedRoute) {}

	get selectedMunro(): Munro {
		return this._selectedMunro;
	}

	get completedMunro(): CompletedMunro {
		return this._completedMunro;
	}

	get isNewCompletedMunro(): boolean {
		return !this._completedMunro.dateCompleted;
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

		this.munroStatus$.pipe(take(1)).subscribe(result => {
			this.munroLoading = false;
			this._selectedMunro = new Munro(result.munro);
			this._completedMunro = new CompletedMunro(result.completedMunro);
			this.initForm();
		});
	}

	initForm() {
		this.completedMunroForm = this._completedMunro.createForm(this.fb);
		this.completedMunroForm.controls['munroId'].setValue(this.selectedMunro._id);
	}

	onRatingChanged(newRating: number) {
		this.completedMunroForm.controls['rating'].setValue(newRating);
	}

	saveCompletedMunro() {
		if (this.isNewCompletedMunro) {
			this.munroService
				.addUserCompletedMunroSingle(this.completedMunroForm.value)
				.pipe(take(1))
				.subscribe(data => {
					this._completedMunro = new CompletedMunro(data);
				});
		} else {
			this.munroService.updatedUserCompletedMunro(this.completedMunroForm.value).pipe(take(1)).subscribe();
		}
	}

	removeCompletedMunro() {
		console.log(this._completedMunro);
		this.munroService
			.removeCompletedMunro(this.completedMunro._id)
			.pipe(take(1))
			.subscribe(() => {
				this._completedMunro = new CompletedMunro();
			});
	}
}

