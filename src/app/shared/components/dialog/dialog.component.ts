import { Component } from '@angular/core';
import { DialogService } from './dialog.service';

@Component({
	selector: 'app-dialog',
	templateUrl: 'dialog.component.html',
	standalone: false,
})
export class DialogComponent {
    constructor(public dialogService: DialogService) {}

    openDialog() {
        this.dialogService.openDialog();
    }

    closeDialog() {
        this.dialogService.closeDialog();
    }
}
