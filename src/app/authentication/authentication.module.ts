import { AuthenticationComponent } from './authentication.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';

@NgModule({
	declarations: [AuthenticationComponent, RegisterComponent, LoginComponent],
	imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
	exports: [AuthenticationComponent],
})
export class AuthenticationModule {}

