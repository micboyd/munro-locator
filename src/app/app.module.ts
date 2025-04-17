import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
	declarations: [AppComponent],
	imports: [BrowserModule, AppRoutingModule, AuthenticationModule, DashboardModule],
	providers: [provideHttpClient()],
	bootstrap: [AppComponent],
})
export class AppModule {}

