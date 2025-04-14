import { Component, OnInit } from "@angular/core";

import { AuthenticationService } from "../services/authentication.service";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.component.html",
    standalone: false,
})

export class DashboardComponent implements OnInit {
    constructor(private authenticationService: AuthenticationService) {}

    get currentLoggedInUser() {
        return this.authenticationService.fullName;
    }

    ngOnInit() {}
}
