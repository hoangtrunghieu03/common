import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentAddDialogComponent } from './appointment-add-dialog.component';

describe('AppointmentAddDialogComponent', () => {
  let component: AppointmentAddDialogComponent;
  let fixture: ComponentFixture<AppointmentAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppointmentAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
