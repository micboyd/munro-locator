import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { CommonModule } from '@angular/common';
import { ContainerComponent } from './components/container/container.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FullscreenLoaderComponent } from './components/fullscreen-loader/fullscreen-loader.component';
import { LoadingIndicatorComponent } from './components/loading-indicator/loading-indicator.component';
import { NgModule } from '@angular/core';
import { RatingComponent } from './components/rating/rating.component';
import { TabsComponent } from './components/tabs/tabs.component';
import { WeatherComponent } from './components/weather/weather.component';
import { HeroComponent } from './components/hero/hero.component';
import { NavigationComponent } from './navigation/navigation.component';
import { PagerComponent } from './components/pager/pager.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchComponent } from './components/search/search.component';
import { MapComponent } from './components/map/map.component';

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
	imports: [FontAwesomeModule, CommonModule, FormsModule, ReactiveFormsModule],
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

