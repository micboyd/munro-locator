import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { MapComponent } from './map/map.component';
import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
	declarations: [AppComponent, MapComponent],
	imports: [BrowserModule],
	providers: [provideHttpClient()],
	bootstrap: [AppComponent],
})
export class AppModule {}
