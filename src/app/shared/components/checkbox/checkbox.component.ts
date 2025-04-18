import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-checkbox',
	templateUrl: './checkbox.component.html',
	standalone: false,
})
export class CheckboxComponent {
	@Input()
	checked: boolean = false;

	@Input()
	label: string = '';

	@Output()
	checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

	toggleCheckbox() {
		this.checked = !this.checked;
		this.checkedChange.emit(this.checked);
	}
}

