import { RouterModule, Routes } from '@angular/router';

import { AuthenticationComponent } from './authentication/authentication.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { AuthGuard } from './guards/authentication.guard';
import { MountainManagerComponent } from './dashboard/mountain-manager/mountain-manager.component';

const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: 'login', component: AuthenticationComponent },
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard],
		children: [{ path: 'mountain-manager', component: MountainManagerComponent, canActivate: [AuthGuard] }],
	},
	{ path: '**', redirectTo: '/login' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}

