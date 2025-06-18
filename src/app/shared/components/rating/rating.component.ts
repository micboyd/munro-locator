import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-rating',
	templateUrl: './rating.component.html',
    standalone: false,
})
export class RatingComponent {
	@Input() readonly = false;

	private _rating = 0;
	@Input() set rating(value: number | undefined) {
		this._rating = value ?? 0;
	}
	get rating(): number {
		return this._rating;
	}

	@Output() ratingChange = new EventEmitter<number>();

	stars = [1, 2, 3, 4, 5];

	setRating(star: number) {
		if (!this.readonly) {
			this._rating = star;
			this.ratingChange.emit(this._rating);
		}
	}
}
