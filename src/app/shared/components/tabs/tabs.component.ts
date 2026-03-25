import { Component, EventEmitter, Input, OnChanges, Output } from "@angular/core";

@Component({
	selector: "app-tabs",
	standalone: false,
	templateUrl: "./tabs.component.html",
})
export class TabsComponent implements OnChanges {
	@Input() tabs: string[] = [];
	@Input() selectedTab = "";
	@Output() activeTabChange = new EventEmitter<string>();

	activeTab = "";

	ngOnChanges(): void {
		if (this.selectedTab && this.selectedTab !== this.activeTab) {
			this.activeTab = this.selectedTab;
		} else if (this.tabs.length && !this.activeTab) {
			this.setActive(this.tabs[0]);
		}
	}

	setActive(tab: string): void {
		this.activeTab = tab;
		this.activeTabChange.emit(tab);
	}
}