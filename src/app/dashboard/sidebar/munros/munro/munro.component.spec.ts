import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunroComponent } from './munro.component';

describe('MunroComponent', () => {
  let component: MunroComponent;
  let fixture: ComponentFixture<MunroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MunroComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MunroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
