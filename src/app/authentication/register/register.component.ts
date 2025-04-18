import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { User } from '../../shared/models/User';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	standalone: false,
})
export class RegisterComponent implements OnInit {
	registerForm: FormGroup;
	loginErrorMessage: string = '';
	registerLoading: boolean = false;
	faSpinner = faSpinner;

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
				new User({
					firstname: this.registerForm.value.firstname,
					lastname: this.registerForm.value.lastname,
					username: this.registerForm.value.username,
					password: this.registerForm.value.password,
				} as User),
			)
			.subscribe({
				next: loginData => {
					this.router.navigate(['/login']);
					this.registerLoading = false;
				},
				error: () => {
					this.loginErrorMessage = 'Incorrect username or password. Please try again.';
					this.registerLoading = false;
				},
			});
	}

	isInvalid(controlName: string): boolean {
		const control = this.registerForm.get(controlName);
		return !!(control && control.invalid && control.touched);
	}
}

