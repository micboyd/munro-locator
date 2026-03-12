import { AppRoutingModule } from '../app-routing.module';
import { BoardComponent } from './board/board.component';
import { CommonModule } from '@angular/common';
import { CompleteMountainComponent } from './board/complete-mountain/complete-mountain.component';
import { DashboardComponent } from './dashboard.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { GoalsComponent } from './profile/goals/goals.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from './profile/profile.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { LibraryComponent } from './library/library.component';

@NgModule({
	declarations: [
		DashboardComponent,
		ProfileComponent,
        GoalsComponent,
		EditProfileComponent,
        BoardComponent,
        CompleteMountainComponent,
		LibraryComponent
    ],
	imports: [CommonModule, ReactiveFormsModule, AppRoutingModule, SharedModule],
	exports: [DashboardComponent],
    providers: [ProfileService]
})
export class DashboardModule {
	constructor() {}
}

