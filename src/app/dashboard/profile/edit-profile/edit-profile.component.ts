import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { AuthenticationService } from '../../../shared/services/authentication.service';
import { ProfileService } from '../profile.service';
import { UserProfile } from '../../../shared/models/Profile/UserProfile';

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

    selectedFile: File | null = null;
    previewUrl: string | null = null;

    constructor(
        private authService: AuthenticationService,
        private profileService: ProfileService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit(): void {
        this.form = this.selectedUserProfile.createForm(this.formBuilder);
        this.previewUrl = this.selectedUserProfile.profileImage ?? null;
    }

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        const file = input.files?.[0] ?? null;

        this.selectedFile = file;

        if (file) {
            const reader = new FileReader();
            reader.onload = () => (this.previewUrl = reader.result as string);
            reader.readAsDataURL(file);
        }
    }

    saveProfile(): void {
        const fd = new FormData();

        fd.append('firstName', this.form.get('firstName')?.value ?? '');
        fd.append('lastName', this.form.get('lastName')?.value ?? '');
        fd.append('bio', this.form.get('bio')?.value ?? '');

        if (this.selectedFile) {
            fd.append('profileImage', this.selectedFile);
        }

        if (this.selectedUserProfile.id) {
            this.profileService.updateProfileById(this.selectedUserProfile.id, fd).subscribe((p) => {
                this.saved.emit(p);
            });
        } else {
            fd.append('userId', this.authService.userId);

            this.profileService.createProfile(fd).subscribe((p) => {
                this.saved.emit(p);
            });
        }
    }

    cancelEdit(): void {
        this.closeEditMode.emit();
    }
}
