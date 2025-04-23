import { Component, Input } from '@angular/core';

@Component({
	selector: 'app-container',
	templateUrl: './container.component.html',
	standalone: false,
})
export class ContainerComponentt {
	constructor() {}

    @Input()
    loading: boolean = false;
}

