import { Component, OnInit } from '@angular/core';
import { Munro } from 'src/models/munro';
import { DashboardService } from '../../dashboard.service';

@Component({
    selector: 'app-munros',
    templateUrl: './munros.component.html',
    styleUrls: ['./munros.component.scss'],
})
export class MunrosComponent implements OnInit {
    completeMunros: Munro[];
    completeMunrosLoaded = false;
    incompleteMunros: Munro[];
    incompleteMunrosLoaded = false;

    showIncomplete = true;

    constructor(private dashboardService: DashboardService) {}

    ngOnInit(): void {
        this.getCompleteMunros();
        this.getIncompleteMunros();
    }

    tabSelection(selection: boolean): void {
        if (selection) {
            this.showIncomplete = true;
        } else {
            this.showIncomplete = false;
        }
    }

    getCompleteMunros(): void {
        this.dashboardService
            .getCompletedMunros(this.dashboardService.currentUser)
            .subscribe((data) => {
                this.completeMunros = data;
                this.completeMunrosLoaded = true;
            });
    }

    getIncompleteMunros(): void {
        this.dashboardService
            .getIncompleteMunros(this.dashboardService.currentUser)
            .subscribe((data) => {
                this.incompleteMunros = data;
                this.incompleteMunrosLoaded = true;
            });
    }

    updateMunroStatus(update: boolean, munroId: any) {
        const payload = {
            munros: [munroId],
        };

        this.dashboardService
            .updateMunro(update, this.dashboardService.currentUser, payload)
            .subscribe(
                (data) => {
                    this.getIncompleteMunros();
                    this.getCompleteMunros();
                }
            );
    }
}
