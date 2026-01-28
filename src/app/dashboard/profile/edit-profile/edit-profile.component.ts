import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProfileService } from '../profile.service';
import { UserProfile } from '../../../shared/models/Profile/UserProfile';
import { AuthenticationService } from '../../../shared/services/authentication.service';

@Component({
    selector: 'app-edit-profile',
    templateUrl: './edit-profile.component.html',
    standalone: false,
})
export class EditProfileComponent implements OnInit {
    @Input() selectedUserProfile!: UserProfile;

    @Output() closeEditMode = new EventEmitter<void>();
    @Output() saved = new EventEmitter<UserProfile>();

    form!: FormGroup;

    constructor(
        private authService: AuthenticationService,
        private profileService: ProfileService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.form = this.selectedUserProfile.createForm(this.formBuilder);
    }

    saveProfile(): void {
        if (this.selectedUserProfile.id) {
            this.profileService.updateProfileById(
                this.selectedUserProfile.id,
                this.form.value)
                .subscribe(() => {
                    this.saved.emit();
                });
        } else {
            this.form.get('userId').setValue(this.authService.userId);
            this.profileService.createProfile(
                this.form.value)
                .subscribe(() => {
                    this.saved.emit();
                });
        }
    }

    cancelEdit(): void {
        this.closeEditMode.emit();
    }
}
