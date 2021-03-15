import { DashboardService } from './../dashboard.service';
import { Munro } from '../../../models/munro';
import { Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-incomplete',
    templateUrl: './incomplete.component.html',
    styleUrls: ['./incomplete.component.scss'],
})
export class IncompleteComponent implements OnInit {
    incompleteMunros: Munro[];
    incompleteMunrosLoaded = false;
    currentUser: string;

    constructor(private dashboardService: DashboardService) {}

    ngOnInit(): void {
        this.currentUser = localStorage.getItem('userid');
        this.getIncompleteMunros(this.currentUser);
    }

    getIncompleteMunros(userId: string): void {
        this.incompleteMunrosLoaded = false;
        this.dashboardService.getIncompleteMunros(userId).subscribe(
            (data: Munro[]) => {
                this.incompleteMunros = data;
                this.incompleteMunrosLoaded = true;
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    markStatus(event: any, munroId: any): void {
        event.target.parentElement.style.display = 'none';

        const payload = {
            munros: [munroId],
        };

        this.dashboardService
            .updateMunro(true, this.currentUser, payload)
            .subscribe(
                (data) => {},
                (error: any) => {
                    console.log(error);
                }
            );
    }
}
