import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AuthUser } from '../../shared/models/AuthUser';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	standalone: false,
})
export class RegisterComponent implements OnInit {
	registerForm: FormGroup;
    loginGenericMessage: string = '';
	loginErrorMessage: string = '';
	registerLoading: boolean = false;

	constructor(private authenticationService: AuthenticationService, private router: Router) {
		this.registerForm = new FormGroup({
			firstname: new FormControl('', [Validators.required]),
			lastname: new FormControl('', [Validators.required]),
			username: new FormControl('', [Validators.email, Validators.required]),
			password: new FormControl('', [Validators.required]),
		});
	}

	get canSubmit() {
		return this.registerForm.valid && !this.registerLoading;
	}

	get formInvalid() {
		return this.registerForm.invalid && this.registerForm.touched;
	}

	ngOnInit() {
		localStorage.clear();
	}

	onSubmit() {
		this.registerLoading = true;
		this.authenticationService
			.register(
				new AuthUser({
					firstname: this.registerForm.value.firstname,
					lastname: this.registerForm.value.lastname,
					username: this.registerForm.value.username,
					password: this.registerForm.value.password,
				}),
			)
			.subscribe({
				next: loginData => {
					this.loginErrorMessage = loginData;
					this.registerLoading = false;
				},
				error: (err) => {
					this.loginErrorMessage = err.msg;
					this.registerLoading = false;
				},
			});
	}

	isInvalid(controlName: string): boolean {
		const control = this.registerForm.get(controlName);
		return !!(control && control.invalid && control.touched);
	}
}

