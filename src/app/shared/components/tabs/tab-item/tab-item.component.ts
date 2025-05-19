import { Component, Input, TemplateRef, ContentChild } from '@angular/core';

@Component({
	selector: 'app-tab-item',
	template: '',
	standalone: false,
})
export class TabItemComponent {
	@Input() title = '';
	@Input() active = false;
	@ContentChild(TemplateRef) template!: TemplateRef<any>;
}

