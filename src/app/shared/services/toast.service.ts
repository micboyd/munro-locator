import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {

    message = '';
    visible = false;

    private _timer: ReturnType<typeof setTimeout> | null = null;

    show(message: string, duration = 3000): void {
        if (this._timer) {
            clearTimeout(this._timer);
        }
        this.message = message;
        this.visible = true;
        this._timer = setTimeout(() => {
            this.visible = false;
            this._timer = null;
        }, duration);
    }
}
