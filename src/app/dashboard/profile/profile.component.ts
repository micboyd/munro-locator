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
	selectedImageFile: File = null;
	imagePreviewUrl: string | ArrayBuffer = null;

	constructor(public userService: UserService, private fb: FormBuilder) {}

	ngOnInit(): void {
		this.getUser();
	}

	onImageSelect(event: any) {
		const file = event.target.files[0];
		if (file) {
			this.selectedImageFile = file;

			const reader = new FileReader();
			reader.onload = () => {
				this.imagePreviewUrl = reader.result;
			};
			reader.readAsDataURL(file);
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

		const formData = new FormData();

		Object.entries(this.userForm.value).forEach(([key, value]) => {
			if (value !== undefined && value !== null) {
				formData.append(key, value as any);
			}
		});

		if (this.selectedImageFile) {
			formData.append('image', this.selectedImageFile, this.selectedImageFile.name);
		}

		this.userService.updateUser(this.userService.currentUser.id, formData).subscribe(updatedUser => {
			this.profileLoading = false;
			this.selectedUser = new User(updatedUser);
			this.userService.userChanged.next();
			this.selectedImageFile = null;
			this.imagePreviewUrl = null;
		});
	}

	initForm() {
		this.userForm = this.selectedUser.createForm(this.fb);
		this.formInitilised = true;
	}
}
