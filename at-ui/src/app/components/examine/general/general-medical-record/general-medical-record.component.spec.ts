import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralMedicalRecordComponent } from './general-medical-record.component';

describe('GeneralMedicalRecordComponent', () => {
  let component: GeneralMedicalRecordComponent;
  let fixture: ComponentFixture<GeneralMedicalRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralMedicalRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralMedicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
