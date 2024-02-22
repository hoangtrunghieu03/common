import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtDatepickerComponent } from './at-datepicker.component';

describe('AtDatepickerComponent', () => {
  let component: AtDatepickerComponent;
  let fixture: ComponentFixture<AtDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
