import { Component, Input, OnInit } from '@angular/core';
import { DashboardService } from './../../dashboard.service';
import { User } from './../../../../models/user';
import { Munro } from './../../munro';

@Component({
    selector: 'app-munros',
    templateUrl: './munros.component.html',
    styleUrls: ['./munros.component.scss'],
})
export class MunrosComponent implements OnInit {
    @Input() currentUser: User;
    @Input() munrosToDisplay: Munro[];

    constructor(
        private dashboardService: DashboardService
    ) {}

    ngOnInit(): void {}

    // markStatus(event: any, munroId: any): void {
    //     const status = event.target.checked;

    //     const payload = {
    //         _id: munroId
    //     };

    //     this.dashboardService.markMunroStatus(this.currentUser._id, status, payload).subscribe(
    //         (data) => {
    //             console.log('great success');
    //         },
    //         (error: any) => {
    //             console.log(error);
    //         }
    //     );
    // }
}
