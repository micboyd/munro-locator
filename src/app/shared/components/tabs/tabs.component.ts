import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { TabItemComponent } from './tab-item/tab-item.component';

@Component({
	selector: 'app-tabs',
	templateUrl: './tabs.component.html',
	standalone: false,
})
export class TabsComponent implements AfterContentInit {
	@ContentChildren(TabItemComponent) tabs!: QueryList<TabItemComponent>;

	ngAfterContentInit() {
		const activeTabs = this.tabs.filter(tab => tab.active);
		if (activeTabs.length === 0 && this.tabs.length > 0) {
			this.selectTab(this.tabs.first);
		}
	}

	selectTab(tab: TabItemComponent) {
		this.tabs.forEach(t => (t.active = false));
		tab.active = true;
	}
}

