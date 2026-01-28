import { Component, Input, OnInit } from '@angular/core';

import { ProfileService } from '../profile.service';
import { UserProfile } from '../../../shared/models/Profile/UserProfile';

@Component({
    selector: 'app-goals',
    templateUrl: './goals.component.html',
    standalone: false,
})

export class GoalsComponent implements OnInit {

    @Input()
    selectedUserProfile: UserProfile

    editMode: boolean = false;

    constructor(private profileService: ProfileService) {}

    ngOnInit(): void {}

    addGoal() {
        this.editMode = true;
    }

    saveGoal() {
        this.editMode = false;
    }

    cancel() {
        this.editMode = false;
    }
}
