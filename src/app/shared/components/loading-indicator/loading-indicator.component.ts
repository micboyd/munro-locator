import { Component, Input } from '@angular/core';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-loading-indicator',
  templateUrl: 'loading-indicator.component.html',
  styleUrls: ['loading-indicator.component.css'],
  standalone: false
})
export class LoadingIndicatorComponent {

    @Input()
    spinner: boolean = false;

	faSpinner = faSpinner;
}
