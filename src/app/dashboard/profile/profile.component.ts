import { Component, OnInit } from '@angular/core';

import { ProfileService } from './profile.service';
import { UserProfile } from '../../shared/models/Profile/UserProfile';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    standalone: false,
})
export class ProfileComponent implements OnInit {

    private _selectedUserProfile: UserProfile = null;

    get selectedUserProfile() {
        return this._selectedUserProfile;
    }

    constructor(private profileService: ProfileService) {}

    ngOnInit(): void {
        this.getUserProfile();
    }

    getUserProfile() {
        this.profileService.getProfileByUserId().subscribe({
            next: (response) => {
                this._selectedUserProfile = response;
            },
            error: (error) => {
                if (error.status === 404) {
                    this._selectedUserProfile = new UserProfile();
                }
            }
        });
    }
}
