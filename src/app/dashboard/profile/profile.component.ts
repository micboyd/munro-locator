import { Component, OnInit } from '@angular/core';

import { ProfileService } from './profile.service';
import { UserProfile } from '../../shared/models/Profile/UserProfile';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    providers: [ProfileService],
    standalone: false,
})
export class ProfileComponent implements OnInit {

    constructor(private profileService: ProfileService) {}

    private _selectedProfile: UserProfile = null;

    ngOnInit(): void {
        this.getUserProfile();
    }

    getUserProfile() {
        this.profileService.getByUserId().subscribe({
            next: (response) => {
                this._selectedProfile = response;
            },
            error: (error) => {
                if (error.status === 404) {
                    // do something to build profile;
                }
            }
        });
    }
}
