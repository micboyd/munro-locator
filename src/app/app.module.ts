import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { BackendConfig } from './config/backend-environment';

import { AuthGuardService } from './authentication/authguard.service';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './authentication/authentication.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StyleguideComponent } from './styleguide/styleguide.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { UserDetailsComponent } from './dashboard/user-details/user-details.component';

@NgModule({
    declarations: [
        AppComponent,
        AuthenticationComponent,
        DashboardComponent,
        StyleguideComponent,
        UserDetailsComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        GoogleMapsModule
    ],
    providers: [BackendConfig, AuthGuardService],
    bootstrap: [AppComponent],
})
export class AppModule {}
