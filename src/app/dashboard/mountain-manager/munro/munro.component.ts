import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, combineLatest, map, of } from 'rxjs';
import { catchError, take } from 'rxjs/operators';

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
	munroId: string = '';

	selectedPhotos: { file: File; preview: string }[] = [];
	expandedPhoto: string | null = null;
	editMode: boolean = false;

	private _selectedMunro: Munro = null;
	private _completedMunro: CompletedMunro = null;

	completedMunroForm: FormGroup = null;
	munroSaving: boolean = false;
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
		this.munroId = this.route.snapshot.paramMap.get('id');
		this.getMunroDetails(this.munroId);
	}

	getMunroDetails(munroId: string) {
		this.munroLoading = true;
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

	onEditClick() {
		this.editMode = true;
	}

	onPhotosSelected(event: Event): void {
		const input = event.target as HTMLInputElement;
		if (input.files) {
			this.selectedPhotos = Array.from(input.files).map(file => ({
				file,
				preview: URL.createObjectURL(file),
			}));
		}

		this.completedMunroForm.get('summitImages')?.setValue(Array.from(input.files));
	}

	saveCompletedMunro() {
		this.munroSaving = true;
		const formValue = this.completedMunroForm.value; // Use FormData if photos exist and have files
		const hasPhotos =
			formValue.summitImages && Array.isArray(formValue.summitImages) && formValue.summitImages.length > 0;
		const body = hasPhotos ? this.buildFormData(formValue) : formValue;

		if (this.isNewCompletedMunro) {
			this.munroService
				.addUserCompletedMunroSingle(body)
				.pipe(take(1))
				.subscribe(data => {
					this._completedMunro = new CompletedMunro(data);
					this.munroSaving = false;
					this.editMode = false;
					this.getMunroDetails(this.munroId);
				});
		} else {
			this.munroService
				.updatedUserCompletedMunro(body, formValue.munroId)
				.pipe(take(1))
				.subscribe(() => {
					this.munroSaving = false;
					this.editMode = false;
					this.getMunroDetails(this.munroId);
				});
		}
	}

	removeCompletedMunro() {
		this.munroService
			.removeCompletedMunro(this.completedMunro._id)
			.pipe(take(1))
			.subscribe(() => {
				this._completedMunro = new CompletedMunro();
				this.editMode = false;
			});
	}

	openPhoto(photoUrl: string) {
		this.expandedPhoto = photoUrl;
	}
	closePhoto() {
		this.expandedPhoto = null;
	}

	private buildFormData(formValue: any): FormData {
		const formData = new FormData();

		formData.append('munroId', formValue.munroId ?? '');
		formData.append('notes', formValue.notes ?? '');
		formData.append('rating', formValue.rating ?? '');

		if (formValue.summitImages && Array.isArray(formValue.summitImages)) {
			formValue.summitImages.forEach((file: File) => {
				if (file) formData.append('summitImages', file);
			});
		}

		return formData;
	}
}
