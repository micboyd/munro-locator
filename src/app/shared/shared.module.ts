import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from "../app-routing.module";
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './components/container/container.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FullscreenLoaderComponent } from './components/fullscreen-loader/fullscreen-loader.component';
import { HeroComponent } from './components/hero/hero.component';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { MapComponent } from './components/map/map.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { NgModule } from '@angular/core';
import { PagerComponent } from './components/pager/pager.component';
import { RatingComponent } from './components/rating/rating.component';
import { SearchComponent } from './components/search/search.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { WeatherComponent } from './components/weather/weather.component';

@NgModule({
	declarations: [
		CheckboxComponent,
		TabsComponent,
		LoadingIndicatorComponent,
		RatingComponent,
        ContainerComponent,
		WeatherComponent,
        FullscreenLoaderComponent,
		HeroComponent,
		NavigationComponent,
		PagerComponent,
		SearchComponent,
		MapComponent
	],
	imports: [FontAwesomeModule, CommonModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
	exports: [
		CheckboxComponent,
		TabsComponent,
		LoadingIndicatorComponent,
		RatingComponent,
        ContainerComponent,
		WeatherComponent,
        FullscreenLoaderComponent,
		HeroComponent,
		NavigationComponent,
		PagerComponent,
		SearchComponent,
		MapComponent
	],
})
export class SharedModule {}

