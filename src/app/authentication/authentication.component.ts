import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from './authentication.service';
import { LoginData } from './loginData';
@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
    loginForm: FormGroup;
    currentUser: LoginData;
    loading: boolean;
    serverError = false;
    errorMessage: string;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private authService: AuthenticationService
    ) {}

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });
    }

    onSubmit(): void {
        this.loading = true;
        this.authService.userAuthentication(this.loginForm.value).subscribe(
            (data: LoginData) => {
                this.currentUser = data;
                this.storeLoginData(this.currentUser);
                this.loading = false;
            },
            (error: any) => {
                this.serverError = true;
                this.errorMessage = error.error;
                this.loading = false;
            }
        );
    }

    storeLoginData(currentUser): void {
        console.log(currentUser);
        localStorage.setItem('token', currentUser.token);
        localStorage.setItem('userid', currentUser.userid);
        localStorage.setItem('username', currentUser.username);
        this.router.navigate(['dashboard']);
    }
}
