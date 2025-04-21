import { Component, ContentChild, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: 'tab.component.html',
  standalone: false
})
export class TabComponent {
  @Input() title = '';
  @Input() active = false;

  @ContentChild(TemplateRef, { static: true }) content!: TemplateRef<any>;
}
