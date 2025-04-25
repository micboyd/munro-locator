import { Component, OnInit } from '@angular/core';

import { User } from '../../shared/models/User';
import { UserService } from '../../shared/services/user.service';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	standalone: false,
})
export class ProfileComponent implements OnInit {
	userForm: FormGroup = null;
	faPen = faPen;

	profileLoading: boolean = false;

	constructor(public userService: UserService, private fb: FormBuilder) {}

	ngOnInit(): void {
		this.userService.userLoaded.subscribe(() => {
			this.userForm = this.userService.currentUser.createForm(this.fb);
		});
	}

	onImageSelect(event: any, user: User) {
		const file = event.target.files[0];

		this.profileLoading = true;

		if (file) {
			const formData = new FormData();
			formData.append('image', file, file.name);
			this.userService.updateProfilePicture(user.id, formData).subscribe(response => {
				this.profileLoading = false;
				this.userService.currentUser.profileImage = response.profileImage;
				this.userService.userChanged.next();
			});
		}
	}

	updateUser() {
		this.profileLoading = true;
		this.userService.updateUser(this.userService.currentUser.id, this.userForm.value).subscribe(updatedUser => {
			this.profileLoading = false;
			this.userService.userChanged.next();
		});
	}
}

