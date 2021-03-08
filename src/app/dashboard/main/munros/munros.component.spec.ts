import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MunrosComponent } from './munros.component';

describe('MunrosComponent', () => {
  let component: MunrosComponent;
  let fixture: ComponentFixture<MunrosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MunrosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MunrosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
