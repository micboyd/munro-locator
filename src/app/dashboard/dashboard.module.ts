import { AppRoutingModule } from '../app-routing.module';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { GoalsComponent } from './profile/goals/goals.component';
import { MountainComponent } from './mountain/mountain.component';
import { MountainManagerComponent } from './mountain-manager/mountain-manager.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from './profile/profile.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { SidebarComponent } from './sidebar/sidebar.component';

@NgModule({
	declarations: [
		DashboardComponent,
		SidebarComponent,
		MountainManagerComponent,
		ProfileComponent,
        MountainComponent,
        GoalsComponent
    ],
	imports: [CommonModule, ReactiveFormsModule, AppRoutingModule, SharedModule],
	exports: [DashboardComponent],
    providers: [ProfileService]
})
export class DashboardModule {
	constructor() {}
}

