export class UserProfileResponse {
    _id: string;
    userId: string;
    firstName: string;
    lastName: string;
    bio: string;
    profileImage: string;
    completedMountain: []
    createdAt: Date;
    updatedAt: Date;

    constructor() {}
}
