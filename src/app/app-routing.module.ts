import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuardService as AuthGuard } from './authentication/authguard.service';
import { AuthenticationComponent } from './authentication/authentication.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StyleguideComponent } from './styleguide/styleguide.component';

const routes: Routes = [
    {
        path: 'login',
        component: AuthenticationComponent,
    },
    {
        path: 'styleguide',
        component: StyleguideComponent,
        canActivate: [AuthGuard],
    },
    {
        path: 'dashboard',
        component: DashboardComponent
    },
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
