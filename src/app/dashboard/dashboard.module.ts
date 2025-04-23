import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MountainManagerComponent } from './mountain-manager/mountain-manager.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LocatorComponent } from './locator/locator.component';

@NgModule({
	declarations: [DashboardComponent, SidebarComponent, MountainManagerComponent, ProfileComponent, LocatorComponent],
	imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, AppRoutingModule, SharedModule],
	exports: [DashboardComponent],
})
export class DashboardModule {}

