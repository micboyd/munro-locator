import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../../shared/services/authentication.service';

type ConfirmState = 'loading' | 'success' | 'error' | 'no-token';

@Component({
    selector: 'app-confirm',
    templateUrl: './confirm.component.html',
    standalone: false,
})
export class ConfirmComponent implements OnInit {
    state: ConfirmState = 'loading';
    errorMessage = '';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private authService: AuthenticationService,
    ) {}

    ngOnInit(): void {
        const token = this.route.snapshot.queryParamMap.get('token');
        if (!token) {
            this.state = 'no-token';
            return;
        }

        this.authService.confirmEmail(token).subscribe({
            next: () => {
                this.state = 'success';
            },
            error: (err) => {
                this.errorMessage = err?.error?.message ?? 'This confirmation link is invalid or has expired.';
                this.state = 'error';
            },
        });
    }

    goToLogin(): void {
        this.router.navigate(['/login']);
    }
}
