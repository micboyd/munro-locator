import { FormBuilder, FormGroup } from "@angular/forms";

import { UserProfileResponse } from "./UserProfileResponse";

export class UserProfile {

    id: string = null;
    userId: string = null;
    firstName: string = null;
    lastName: string = null;
    bio: string = null;
    profileImage: string = null;
    createdAt: Date = null;
    updatedAt: Date = null;

    constructor(response: UserProfileResponse) {
        this.id = response._id;
        this.userId = response.userId;
        this.firstName = response.firstName;
        this.lastName = response.lastName;
        this.bio = response.bio;
        this.profileImage = response.bio;
        this.createdAt = response.createdAt;
        this.updatedAt = response.updatedAt;
    }

    createForm(fb: FormBuilder): FormGroup {
		return fb.group({
            firstName: [this.firstName ? this.firstName : ''],
            lastName: [this.lastName ? this.lastName : ''],
            bio: [this.bio ? this.bio : ''],
            profileImage: [this.profileImage ? this.id : ''],
            createdAt: [this.createdAt ? this.createdAt : new Date()],
            updatedAt: [this.updatedAt ? this.updatedAt : new Date()],
		});
	}
}
