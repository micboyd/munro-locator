import { Component, OnInit } from '@angular/core';

import { MunroService } from '../../../shared/services/munros.service';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-munro',
	templateUrl: './munro.component.html',
	standalone: false,
})
export class MunroComponent implements OnInit {
    constructor(private munroService: MunroService) {}

    faChevronLeft = faChevronLeft;

    ngOnInit() {
        console.log(this.munroService.allMunros);
    }
}

