import { AuthenticationComponent } from './authentication.component';
import { CommonModule } from '@angular/common';
import { ConfirmComponent } from './confirm/confirm.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [AuthenticationComponent, LoginComponent, RegisterComponent, ConfirmComponent],
	imports: [CommonModule, ReactiveFormsModule, SharedModule],
	exports: [AuthenticationComponent, ConfirmComponent],
})
export class AuthenticationModule {}

