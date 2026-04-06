import { AppRoutingModule } from '../app-routing.module';
import { BoardComponent } from './board/board.component';
import { CategoryTrackerComponent } from './board/category-tracker/category-tracker.component';
import { CommonModule } from '@angular/common';
import { CompleteMountainComponent } from './board/complete-mountain/complete-mountain.component';
import { DashboardComponent } from './dashboard.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { FormsModule } from '@angular/forms';
import { GoalsComponent } from './profile/goals/goals.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './profile/profile.component';
import { ProfileService } from './profile/profile.service';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CalendarComponent } from './calendar/calendar.component';
import { LibraryComponent } from './library/library.component';
import { MountainDetailsComponent } from './library/mountain-details/mountain-details.component';
import { TripPlanCardComponent } from './board/trip-plan-card/trip-plan-card.component';
import { TripPlanDetailComponent } from './board/trip-plan-detail/trip-plan-detail.component';
import { TripPlanFormComponent } from './board/trip-plan-form/trip-plan-form.component';
import { TripPlansComponent } from './board/trip-plans/trip-plans.component';
import { WeatherPageComponent } from './weather/weather-page.component';

@NgModule({
	declarations: [
		DashboardComponent,
		ProfileComponent,
        GoalsComponent,
		EditProfileComponent,
        BoardComponent,
        CategoryTrackerComponent,
        CompleteMountainComponent,
		LibraryComponent,
		CalendarComponent,
		MountainDetailsComponent,
        TripPlansComponent,
        TripPlanCardComponent,
        TripPlanDetailComponent,
        TripPlanFormComponent,
        WeatherPageComponent,
    ],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, AppRoutingModule, SharedModule],
	exports: [DashboardComponent],
    providers: [ProfileService]
})
export class DashboardModule {
	constructor() {}
}

