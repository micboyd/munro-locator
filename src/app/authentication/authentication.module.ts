import { AuthenticationComponent } from './authentication.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AuthenticationComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [AuthenticationComponent]
})
export class AuthenticationModule {

}
