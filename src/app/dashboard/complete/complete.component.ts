import { DashboardService } from './../dashboard.service';
import { Munro } from '../../../models/munro';
import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-complete',
    templateUrl: './complete.component.html',
    styleUrls: ['./complete.component.scss'],
})
export class CompleteComponent implements OnInit {
    completeMunros: Munro[];
    outgoingMunro: Munro;
    currentUser: string;
    completeMunrosLoaded = false;
    showBanner = false;

    constructor(private dashboardService: DashboardService) {}

    ngOnInit(): void {
        this.currentUser = localStorage.getItem('userid');
        this.getCompletedMunros(this.currentUser);
    }

    getCompletedMunros(userId: string): void {
        this.completeMunrosLoaded = false;
        this.dashboardService.getCompletedMunros(userId).subscribe(
            (data: Munro[]) => {
                this.completeMunros = data;
                this.completeMunrosLoaded = true;
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    incompleteBanner(munro: Munro): void {
        this.showBanner = true;
        this.outgoingMunro = munro;
    }

    closeBanner(): void {
        this.showBanner = false;
    }

    markStatus(event: any, munroId: any): void {
        event.target.parentElement.style.display = 'none';

        const payload = {
            munros: [munroId],
        };

        this.dashboardService
            .updateMunro(false, this.currentUser, payload)
            .subscribe((data) => {
                this.incompleteBanner(data.removedMunro);
            });
    }
}
