import { AuthGuardService } from './authentication/authguard.service';

import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './authentication/authentication.component';

import { BackendConfig } from './config/backend-environment';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StyleguideComponent } from './styleguide/styleguide.component';
@NgModule({
    declarations: [
        AppComponent,
        AuthenticationComponent,
        DashboardComponent,
        StyleguideComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
    ],
    providers: [BackendConfig, AuthGuardService],
    bootstrap: [AppComponent],
})
export class AppModule {}
