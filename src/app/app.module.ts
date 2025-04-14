import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationComponent } from './authentication/authentication.component';
import { AuthenticationModule } from './authentication/authentication.module';
import { BrowserModule } from '@angular/platform-browser';
import { LocatorComponent } from './locator/locator.component';
import { MapComponent } from './map/map.component';
import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
	declarations: [
        AppComponent,
        MapComponent,
        LocatorComponent
    ],
	imports: [BrowserModule, AppRoutingModule, AuthenticationModule],
	providers: [provideHttpClient()],
	bootstrap: [AppComponent],
})
export class AppModule {}
