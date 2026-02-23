import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';

@Component({
	selector: 'app-tabs',
	templateUrl: './tabs.component.html',
	standalone: false,
})
export class TabsComponent implements OnChanges {

	@Input() tabs: string[] = [];

	@Input() default: string;

	@Output() activeTabChange = new EventEmitter<string>();

	activeTab: string = '';

	allTabs: string[] = [];

	ngOnChanges(changes: SimpleChanges): void {

		this.allTabs = this.tabs.includes('All')
			? this.tabs
			: ['All', ...this.tabs];

		// Set default tab
		if (this.default) {
			this.activeTab = this.default;
		} else {
			this.activeTab = 'All';
		}
	}

	setActive(tab: string): void {
		this.activeTab = tab;
		this.activeTabChange.emit(tab.toLowerCase() === 'all' ? '' : tab);
	}
}