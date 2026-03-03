import { Injectable } from '@angular/core';

@Injectable()
export class DialogService {

    private _dialogOpen = false;

    get dialogOpen(): boolean {
        return this._dialogOpen;
    }

	constructor() {}

    openDialog() {
        this._dialogOpen = true;
    }

    closeDialog() {
        this._dialogOpen = false;
    }
}

