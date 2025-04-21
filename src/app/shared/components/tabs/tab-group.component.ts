import { AfterContentInit, Component, ContentChildren, QueryList } from '@angular/core';

import { TabComponent } from './tab/tab.component';

@Component({
  selector: 'app-tab-group',
  templateUrl: './tab-group.component.html',
  standalone: false
})
export class TabGroupComponent implements AfterContentInit {
  @ContentChildren(TabComponent) tabs!: QueryList<TabComponent>;
  selectedIndex = 0;

  ngAfterContentInit(): void {
    const activeTab = this.tabs.toArray().findIndex(tab => tab.active);
    this.selectedIndex = activeTab >= 0 ? activeTab : 0;
  }

  selectTab(index: number): void {
    this.selectedIndex = index;
  }
}
