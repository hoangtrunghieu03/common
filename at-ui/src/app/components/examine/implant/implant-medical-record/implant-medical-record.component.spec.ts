import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImplantMedicalRecordComponent } from './implant-medical-record.component';

describe('ImplantMedicalRecordComponent', () => {
  let component: ImplantMedicalRecordComponent;
  let fixture: ComponentFixture<ImplantMedicalRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImplantMedicalRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImplantMedicalRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
