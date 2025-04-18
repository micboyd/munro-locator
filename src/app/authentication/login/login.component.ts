import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

import { Router } from '@angular/router';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { LoginRequest } from '../../shared/models/LoginRequest';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	standalone: false,
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	loginErrorMessage: string = '';
	loginLoading: boolean = false;
	faSpinner = faSpinner;

	constructor(private authenticationService: AuthenticationService, private router: Router) {
		this.loginForm = new FormGroup({
			username: new FormControl('', [Validators.email, Validators.required]),
			password: new FormControl('', [Validators.required]),
		});
	}

	get canSubmit() {
		return this.loginForm.valid && !this.loginLoading;
	}

	get formInvalid() {
		return this.loginForm.invalid && this.loginForm.touched;
	}

	ngOnInit() {
		localStorage.clear();
	}

	onSubmit() {
		this.loginLoading = true;
		this.authenticationService
			.login(new LoginRequest(this.loginForm.value.username, this.loginForm.value.password))
			.subscribe({
				next: loginData => {
					this.authenticationService.setDetails(loginData);
					this.router.navigate(['/dashboard/mountain-manager']);
					this.loginLoading = false;
				},
				error: () => {
					this.loginErrorMessage = 'Incorrect username or password. Please try again.';
					this.loginLoading = false;
				},
			});
	}

	isInvalid(controlName: string): boolean {
		const control = this.loginForm.get(controlName);
		return !!(control && control.invalid && control.touched);
	}
}

