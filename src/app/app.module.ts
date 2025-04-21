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

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, AppRoutingModule, AuthenticationModule, DashboardModule, CommonModule, SharedModule],
	providers: [provideHttpClient()],
	bootstrap: [AppComponent],
})
export class AppModule {}

