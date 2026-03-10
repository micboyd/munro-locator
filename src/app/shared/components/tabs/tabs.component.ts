import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
	selector: "app-tabs",
	standalone: false,
	templateUrl: "./tabs.component.html",
})
export class TabsComponent {
	@Input() tabs: string[] = [];
	@Output() activeTabChange = new EventEmitter<string>();

	activeTab = "";

	ngOnChanges(): void {
		if (this.tabs.length && !this.activeTab) {
			this.setActive(this.tabs[0]);
		}
	}

	get track() {
		return Math.random();
	}

	setActive(tab: string): void {
		this.activeTab = tab;
		this.activeTabChange.emit(tab);
	}
}