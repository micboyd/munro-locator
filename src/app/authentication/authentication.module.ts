import { AuthenticationComponent } from './authentication.component';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthenticationComponent],
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  exports: [AuthenticationComponent]
})
export class AuthenticationModule {

}
