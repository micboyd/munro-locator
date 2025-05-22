import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { User } from '../../shared/models/User';
import { UserService } from '../../shared/services/user.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	standalone: false,
})
export class ProfileComponent implements OnInit {
	userForm: FormGroup = null;

	selectedUser: User;
	editing = false;
	profileLoading: boolean = false;
	formInitilised: boolean = false;

	constructor(public userService: UserService, private fb: FormBuilder) {}

	ngOnInit(): void {
		this.getUser();
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

	getUser() {
		this.profileLoading = true;
		this.userService.getUser(this.userService.userId).subscribe(user => {
			this.selectedUser = new User(user);
			this.initForm();
			this.profileLoading = false;
		});
	}

	updateUser() {
		this.profileLoading = true;
		this.userService.updateUser(this.userService.currentUser.id, this.userForm.value).subscribe(updatedUser => {
			this.profileLoading = false;
			this.userService.userChanged.next();
		});
	}

	initForm() {
		this.userForm = this.selectedUser.createForm(this.fb);
		this.formInitilised = true;
	}
}

