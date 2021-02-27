import { Component, Input, OnInit } from '@angular/core';
import { Munro } from './../munro';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
    @Input() completeMunros: Munro[];
    @Input() incompleteMunros: Munro[];

    constructor() {}

    ngOnInit(): void {}
}
