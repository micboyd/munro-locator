import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
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

    updateMunroStatus(): void {
        const response = {
            id: this.munroInformation._id,
            isIncomplete: this.isIncomplete
        }

        this.munroStatus.emit(response);
    }

    constructor() {}

    ngOnInit(): void {}
}
