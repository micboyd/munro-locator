import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { DashboardService } from 'src/app/dashboard/dashboard.service';
import { Munro } from 'src/models/munro';
import { Status } from 'src/models/status';

@Component({
    selector: 'app-munro',
    templateUrl: './munro.component.html',
    styleUrls: ['./munro.component.scss'],
})
export class MunroComponent implements OnInit {
    @Input() munroInformation: Munro;
    @Input() isIncomplete: boolean;

    @Output() munroStatus = new EventEmitter<Status>();

    constructor(private dashboardService: DashboardService) {}

    ngOnInit(): void {}

    updateMunroStatus(): void {
        const response = {
            id: this.munroInformation._id,
            isIncomplete: this.isIncomplete
        }

        this.munroStatus.emit(response);
    }

    locateMunro(lat: number, lng: number): void {
        let coordinates = {
            lat: lat,
            lng: lng
        }

        this.dashboardService.munroLocation.emit(coordinates);
    }
}
