// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard implements CanActivate {
	jwtHelper: any;
	constructor(private authenticationService: AuthenticationService, private router: Router) {}

	canActivate(): boolean {
		if (this.authenticationService.isAuthenticated()) {
			return true;
		} else {
			this.router.navigate(['/login']);
			return false;
		}
	}
}

