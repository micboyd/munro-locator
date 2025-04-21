import { AuthenticationComponent } from './authentication.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [AuthenticationComponent, RegisterComponent, LoginComponent],
	imports: [CommonModule, ReactiveFormsModule, SharedModule],
	exports: [AuthenticationComponent],
})
export class AuthenticationModule {}

