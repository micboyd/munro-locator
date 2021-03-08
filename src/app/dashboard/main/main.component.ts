import { Component, Input, OnInit } from '@angular/core';
import { User } from './../../../models/user';
import { Munro } from './../munro';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
    @Input() currentUser: User;
    @Input() completeMunros: Munro[];
    @Input() incompleteMunros: Munro[];
    munrosToDisplay: Munro[];
    selected = false;

    constructor() {}

    ngOnInit(): void {
        if (this.selected) {
            this.munrosToDisplay = this.completeMunros;
        } else {
            this.munrosToDisplay = this.incompleteMunros;
        }
    }
}
