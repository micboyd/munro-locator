import { Component, OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { User } from '../../shared/models/User';
import { UserService } from '../../shared/services/user.service';
import { environment } from '../../../environments/environment';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	standalone: false,
})
export class ProfileComponent implements OnInit {

    faPen = faPen;

	constructor(private userService: UserService) {}

    get currentUser(): User {
        return this.userService.currentUser;
    }

	ngOnInit(): void {}

	onImageSelect(event: any, user: User) {
		const file = event.target.files[0];

		if (file) {
			const formData = new FormData();
			formData.append('image', file, file.name);

            this.userService.updateProfilePicture(user.id, formData).subscribe(
                (response) => {
                    this.userService.currentUser.profileImage = response.profileImage;
                    this.userService.userChanged.next();
                }
            );
		}
	}
}
