import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './components/container/container.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { MapComponent } from './components/map/map.component';
import { NgModule } from '@angular/core';
import { RatingComponent } from './components/rating/rating.component';
import { TabItemComponent } from './components/tabs/tab-item/tab-item.component';
import { TabsComponent } from './components/tabs/tabs.component';

@NgModule({
	declarations: [
		CheckboxComponent,
		MapComponent,
		TabItemComponent,
		TabsComponent,
		LoadingIndicatorComponent,
		RatingComponent,
        ContainerComponent
	],
	imports: [FontAwesomeModule, CommonModule],
	exports: [
		CheckboxComponent,
		MapComponent,
		TabItemComponent,
		TabsComponent,
		LoadingIndicatorComponent,
		RatingComponent,
        ContainerComponent
	],
})
export class SharedModule {}

