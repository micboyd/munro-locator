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
import { MapComponent } from './dashboard/map/map.component';
import { SidebarComponent } from './dashboard/sidebar/sidebar.component';
import { MunrosComponent } from './dashboard/sidebar/munros/munros.component';
import { UserComponent } from './dashboard/sidebar/user/user.component';
import { MunroComponent } from './dashboard/sidebar/munros/munro/munro.component';

@NgModule({
    declarations: [
        AppComponent,
        AuthenticationComponent,
        DashboardComponent,
        StyleguideComponent,
        MapComponent,
        SidebarComponent,
        MunrosComponent,
        UserComponent,
        MunroComponent
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
