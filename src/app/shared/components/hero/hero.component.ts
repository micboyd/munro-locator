import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-hero',
	templateUrl: './hero.component.html',
	standalone: false,
})
export class HeroComponent implements OnInit {

    @Input()
    heroTitle = '';

    @Input()
    heroSubtitle = '';

	constructor() {}

	ngOnInit() {}
}

