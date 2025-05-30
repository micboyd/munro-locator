import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-rating',
	templateUrl: './rating.component.html',
	standalone: false,
})
export class RatingComponent {
	@Input() readonly = false;
	@Input() rating = 0;
	@Output() ratingChange = new EventEmitter<number>();

	stars = [1, 2, 3, 4, 5];

	setRating(star: number) {
        this.rating = star;

		if (!this.readonly) {
			this.ratingChange.emit(this.rating);
		}
	}
}
