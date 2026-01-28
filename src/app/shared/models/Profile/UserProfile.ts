import { FormBuilder, FormGroup } from "@angular/forms";

import { UserProfileResponse } from "./UserProfileResponse";

export class UserProfile {
    id?: string;
    userId?: string;
    firstName?: string;
    lastName?: string;
    bio?: string;
    profileImage?: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(response?: UserProfileResponse) {
        if (!response) return;

        this.id = response._id;
        this.userId = response.userId;
        this.firstName = response.firstName;
        this.lastName = response.lastName;
        this.bio = response.bio;
        this.profileImage = response.profileImage;
        this.createdAt = response.createdAt;
        this.updatedAt = response.updatedAt;
    }

    createForm(fb: FormBuilder): FormGroup {
        return fb.group({
            userId: [this.userId ?? ''],
            firstName: [this.firstName ?? ''],
            lastName: [this.lastName ?? ''],
            bio: [this.bio ?? ''],
            profileImage: [this.profileImage ?? ''],
        });
    }
}

