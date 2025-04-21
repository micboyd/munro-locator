import { Component } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-loading-indicator',
  templateUrl: 'loading-indicator.component.html',
  standalone: false
})
export class LoadingIndicatorComponent {
	faSpinner = faSpinner;
}
