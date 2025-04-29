import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { DashboardModule } from './dashboard/dashboard.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { provideHttpClient } from '@angular/common/http';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		AppRoutingModule,
		AuthenticationModule,
		DashboardModule,
		CommonModule,
		SharedModule,
		FontAwesomeModule,
	],
	providers: [provideHttpClient()],
	bootstrap: [AppComponent],
})
export class AppModule {
	constructor() {
		library.add(fas);
	}
}

