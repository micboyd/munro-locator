import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';

import { AuthenticationService } from '../../shared/services/authentication.service';

function passwordsMatch(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
}

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    standalone: false,
})
export class RegisterComponent {
    @Output() switchToLogin = new EventEmitter<void>();

    form = new FormGroup({
        username: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8)]),
        confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: passwordsMatch });

    loading = false;
    error = '';
    success = false;

    constructor(private authService: AuthenticationService) {}

    get canSubmit() {
        return this.form.valid && !this.loading;
    }

    isInvalid(controlName: string): boolean {
        const control = this.form.get(controlName);
        return !!(control?.invalid && control.touched);
    }

    get passwordMismatch(): boolean {
        return !!(this.form.hasError('passwordMismatch') && this.form.get('confirmPassword')?.touched);
    }

    onSubmit(): void {
        if (!this.form.valid) return;
        this.loading = true;
        this.error = '';

        const { username, password } = this.form.value;
        this.authService.register({ username, password }).subscribe({
            next: () => {
                this.success = true;
                this.loading = false;
            },
            error: (err) => {
                this.error = err?.error?.message ?? 'Registration failed. Please try again.';
                this.loading = false;
            },
        });
    }
}
