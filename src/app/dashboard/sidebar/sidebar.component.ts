import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../shared/services/authentication.service';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	standalone: false,
})
export class SidebarComponent implements OnInit {
	constructor(private authenticationService: AuthenticationService) {}

	ngOnInit() {}

	// get fullname(): string {
	// 	return this.authenticationService.fullName;
	// }
}

