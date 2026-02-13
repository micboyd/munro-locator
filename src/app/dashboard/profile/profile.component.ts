import { Component, Input, OnInit } from '@angular/core';

import { ProfileService } from './profile.service';
import { UserProfile } from '../../shared/models/Profile/UserProfile';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    standalone: false,
})
export class ProfileComponent implements OnInit {

    editMode: boolean = false;
    loading: boolean = true;

    private _selectedUserProfile: UserProfile = null;

    get selectedUserProfile() {
        return this._selectedUserProfile;
    }

    constructor(private profileService: ProfileService) {}

    ngOnInit(): void {
        this.getUserProfile();
    }

    enableEditMode() {
        this.editMode = true;
    }

    closeEditMode() {
        this.editMode = false;
    }

    getUserProfile() {
        this.loading = true;
        this.profileService.getProfileByUserId().subscribe({
            next: (response) => {
                this._selectedUserProfile = response;
                this.editMode = false;
                this.loading = false;
            },
            error: (error) => {
                if (error.status === 404) {
                    this._selectedUserProfile = new UserProfile();
                }
            }
        });
    }
}
