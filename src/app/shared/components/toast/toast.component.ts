import { Component } from '@angular/core';
import { ToastService } from '../../services/toast.service';

@Component({
    selector: 'app-toast',
    templateUrl: './toast.component.html',
    standalone: false,
    styles: [`
        .toast-slide-up {
            animation: toastSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes toastSlideUp {
            from {
                opacity: 0;
                transform: translateY(0.75rem);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `]
})
export class ToastComponent {
    constructor(public toastService: ToastService) {}
}
