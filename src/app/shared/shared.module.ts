import { NgModule } from '@angular/core';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { MapComponent } from './components/map/map.component';

@NgModule({
	declarations: [CheckboxComponent, MapComponent],
	imports: [],
	exports: [CheckboxComponent, MapComponent],
})
export class SharedModule {}

