import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { LocatorComponent } from './locator/locator.component';
import { MountainManagerComponent } from './mountain-manager/mountain-manager.component';
import { MunroComponent } from './mountain-manager/munro/munro.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
	declarations: [
		DashboardComponent,
		SidebarComponent,
		MountainManagerComponent,
		ProfileComponent,
		LocatorComponent,
		MunroComponent,
	],
	imports: [CommonModule, ReactiveFormsModule, AppRoutingModule, SharedModule],
	exports: [DashboardComponent],
})
export class DashboardModule {
	constructor() {}
}

