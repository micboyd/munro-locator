import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { MapComponent } from './components/map/map.component';
import { NgModule } from '@angular/core';
import { TabItemComponent } from './components/tabs/tab-item/tab-item.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { CommonModule } from '@angular/common';

@NgModule({
	declarations: [CheckboxComponent, MapComponent, TabItemComponent, TabsComponent, LoadingIndicatorComponent],
	imports: [FontAwesomeModule, CommonModule],
	exports: [CheckboxComponent, MapComponent, TabItemComponent, TabsComponent, LoadingIndicatorComponent],
})
export class SharedModule {}

