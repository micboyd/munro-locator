import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface SortOption {
    value: string;
    label: string;
}

@Component({
    selector: 'app-mountain-controls',
    templateUrl: './mountain-controls.component.html',
    standalone: false,
})
export class MountainControlsComponent {
    @Input() sortOptions: SortOption[] = [];
    @Input() sortValue: string = '';
    @Input() showMap: boolean = false;
    @Input() total: number = 0;

    @Output() sortChange = new EventEmitter<string>();
    @Output() searchChange = new EventEmitter<string>();
    @Output() mapClick = new EventEmitter<void>();
}
