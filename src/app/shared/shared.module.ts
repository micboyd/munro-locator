import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { MapComponent } from './components/map/map.component';
import { NgModule } from '@angular/core';
import { TabComponent } from './components/tabs/tab/tab.component';
import { TabGroupComponent } from './components/tabs/tab-group.component';

@NgModule({
	declarations: [CheckboxComponent, MapComponent, TabComponent, TabGroupComponent, LoadingIndicatorComponent],
	imports: [FontAwesomeModule],
	exports: [CheckboxComponent, MapComponent, TabComponent, TabGroupComponent, LoadingIndicatorComponent],
})
export class SharedModule {}

