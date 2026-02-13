import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './shared/guards/authentication.guard';
import { AuthenticationComponent } from './authentication/authentication.component';
import { BoardComponent } from './dashboard/board/board.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LibraryComponent } from './dashboard/library/library.component';
import { MountainComponent } from './dashboard/mountain/mountain.component';
import { NgModule } from '@angular/core';
import { ProfileComponent } from './dashboard/profile/profile.component';

const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: AuthenticationComponent },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'board',
                component: BoardComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'profile',
                component: ProfileComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'library',
                component: LibraryComponent,
                canActivate: [AuthGuard],
            },
            {
                path: 'mountain/:mountainId',
                component: MountainComponent,
                canActivate: [AuthGuard]
            }
        ],
    },
    { path: '**', redirectTo: '/login' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule { }

