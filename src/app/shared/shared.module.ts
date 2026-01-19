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
import { WeatherComponent } from './components/weather/weather.component';

@NgModule({
	declarations: [
		CheckboxComponent,
		MapComponent,
		TabItemComponent,
		TabsComponent,
		LoadingIndicatorComponent,
		RatingComponent,
        ContainerComponent,
		WeatherComponent
	],
	imports: [FontAwesomeModule, CommonModule],
	exports: [
		CheckboxComponent,
		MapComponent,
		TabItemComponent,
		TabsComponent,
		LoadingIndicatorComponent,
		RatingComponent,
        ContainerComponent,
		WeatherComponent
	],
})
export class SharedModule {}

