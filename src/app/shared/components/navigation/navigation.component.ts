import { Component } from '@angular/core';
import { ProfileService } from '../../../dashboard/profile/profile.service';
import { UserProfile } from '../../models/Profile/UserProfile';

@Component({
	selector: 'app-navigation',
	templateUrl: 'navigation.component.html',
	standalone: false,
})
export class NavigationComponent {

    private _profileLoading: boolean = false;
    private _profile: UserProfile = null;

    get profileLoading() {
        return this._profileLoading;
    }

    get profile() {
        return this._profile;
    }

    constructor(private profileService: ProfileService) {
        this.loadProfile();
    }

    loadProfile() {
        this._profileLoading = true;
        this.profileService.getProfileByUserId().subscribe((profile) => {
            this._profile = profile;
            this._profileLoading = false;
        });
    }
}

