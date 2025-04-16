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
	loginForm: FormGroup;
	loginErrorMessage: string = '';
    loginLoading: boolean = false;

	constructor(
        private authenticationService: AuthenticationService,
        private router: Router
    ) {
        this.loginForm = new FormGroup({
            username: new FormControl(''),
            password: new FormControl(''),
        });
    }

	ngOnInit() {}

	onSubmit() {
        this.loginLoading = true;
		this.authenticationService
			.login(new LoginRequest(this.loginForm.value.username, this.loginForm.value.password))
			.subscribe({
				next: loginData => {
					this.authenticationService.currentUser = loginData;
					this.router.navigate(['/dashboard']);
                    this.loginLoading = false;
				},
				error: () => {
					this.loginErrorMessage = 'Incorrect username or password. Please try again.';
                    this.loginLoading = false;
				},
			});
	}
}
