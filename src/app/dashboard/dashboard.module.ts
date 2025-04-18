import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AppRoutingModule } from '../app-routing.module';
import { MountainManagerComponent } from './mountain-manager/mountain-manager.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [DashboardComponent, SidebarComponent, MountainManagerComponent],
	imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule, AppRoutingModule, SharedModule],
	exports: [DashboardComponent],
})
export class DashboardModule {}

