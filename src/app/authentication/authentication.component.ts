import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

import { AuthenticationService } from '../services/authentication.service';
import { LoginRequest } from '../models/LoginRequest';
import { Router } from '@angular/router';

@Component({
	selector: 'app-authentication',
	templateUrl: './authentication.component.html',
	standalone: false,
})
export class AuthenticationComponent implements OnInit {
	loginForm = new FormGroup({
		username: new FormControl(''),
		password: new FormControl(''),
	});

	loginErrorMessage: string = '';

	constructor(private authenticationService: AuthenticationService, private router: Router) {}

	ngOnInit() {}

	onSubmit() {
		this.authenticationService
			.login(new LoginRequest(this.loginForm.value.username, this.loginForm.value.password))
			.subscribe({
				next: loginData => {
					this.authenticationService.currentUser = loginData;
					this.router.navigate(['/dashboard']);
				},
				error: () => {
					this.loginErrorMessage = 'Invalid credentials. Please try again.';
				},
			});
	}
}
