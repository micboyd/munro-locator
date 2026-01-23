import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/guards/authentication.guard';
import { AuthenticationComponent } from './authentication/authentication.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LocatorComponent } from './dashboard/locator/locator.component';
import { MountainManagerComponent } from './dashboard/mountain-manager/mountain-manager.component';
import { MunroComponent } from './dashboard/mountain-manager/munro/munro.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './dashboard/profile/profile.component';
import { AlbumComponent } from './dashboard/album/album.component';

const routes: Routes = [
	{ path: '', redirectTo: '/login', pathMatch: 'full' },
	{ path: 'login', component: AuthenticationComponent },
	{
		path: 'dashboard',
		component: DashboardComponent,
		canActivate: [AuthGuard],
		children: [
			{
				path: 'mountain-manager',
				component: MountainManagerComponent,
				canActivate: [AuthGuard],
			},
			{ path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
			// { path: 'map', component: LocatorComponent, canActivate: [AuthGuard] },
		],
	},
	{ path: '**', redirectTo: '/login' },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}

