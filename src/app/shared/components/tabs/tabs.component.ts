import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

import { Category } from '../../models/Mountains/Category';

@Component({
    selector: 'app-tabs',
    templateUrl: './tabs.component.html',
    standalone: false,
})
export class TabsComponent implements OnChanges {

    @Input() tabs: Category[] = [];
    @Input() default: string;
    @Output() activeTabChange = new EventEmitter<string>();

    activeTab: string = '';

    allTabs: Category[] = [];

    ngOnChanges(changes: SimpleChanges): void {

        const hasAll = this.tabs.some(t => t.name === 'All');

        this.allTabs = hasAll
            ? this.tabs
            : [
                new Category({ name: 'All', count: this.tabs.reduce((acc, t) => acc + t.count, 0) }),
                ...this.tabs
            ];

        this.activeTab = this.default || 'All';
    }

    setActive(tab: Category): void {
        this.activeTab = tab.name;
        this.activeTabChange.emit(tab.name.toLowerCase() === 'all' ? '' : tab.name);
    }
}
