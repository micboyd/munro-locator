import { AuthenticationComponent } from './authentication.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

@NgModule({
	declarations: [AuthenticationComponent, LoginComponent],
	imports: [CommonModule, ReactiveFormsModule, SharedModule],
	exports: [AuthenticationComponent],
})
export class AuthenticationModule {}

