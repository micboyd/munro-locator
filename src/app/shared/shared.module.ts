import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './components/container/container.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FullscreenLoaderComponent } from './components/fullscreen-loader/fullscreen-loader.component';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { NgModule } from '@angular/core';
import { RatingComponent } from './components/rating/rating.component';
import { TabItemComponent } from './components/tabs/tab-item/tab-item.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { WeatherComponent } from './components/weather/weather.component';

@NgModule({
	declarations: [
		CheckboxComponent,
		TabItemComponent,
		TabsComponent,
		LoadingIndicatorComponent,
		RatingComponent,
        ContainerComponent,
		WeatherComponent,
        FullscreenLoaderComponent,
	],
	imports: [FontAwesomeModule, CommonModule],
	exports: [
		CheckboxComponent,
		TabItemComponent,
		TabsComponent,
		LoadingIndicatorComponent,
		RatingComponent,
        ContainerComponent,
		WeatherComponent,
        FullscreenLoaderComponent,
	],
})
export class SharedModule {}

