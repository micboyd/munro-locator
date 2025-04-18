import { Component } from '@angular/core';

@Component({
	selector: 'app-authentication',
	templateUrl: './authentication.component.html',
	standalone: false,
})
export class AuthenticationComponent {
	activeTab = 0;
	tabs = [];

	constructor() {
		this.tabs = [{ label: 'Login' }, { label: 'Register' }];
	}
}

