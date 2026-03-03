import { Component, OnInit } from '@angular/core';

import { DialogService } from '../../shared/components/dialog/dialog.service';
import { PlannedMountain } from '../../shared/models/Mountains/PlannedMountain';
import { PlannedMountainsService } from '../../shared/services/planned-mountains.service';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
    providers: [DialogService],
	standalone: false,
})
export class BoardComponent implements OnInit {

	constructor(public plannedMountainService: PlannedMountainsService) {}

    private _plannedMountains: PlannedMountain[] = [];

    get plannedMountains() {
        return this._plannedMountains;
    }

	ngOnInit(): void {
        this.getPlannedMountains();
	}

    getPlannedMountains() {
        this.plannedMountainService.getPlannedMountainsForCurrentUser().subscribe((response) => {
            this._plannedMountains = response;
        });
    }
}

