import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DesignatBlockModalComponent } from './designat-modal.component';

describe('DesignatModalComponent', () => {
  let component: DesignatBlockModalComponent;
  let fixture: ComponentFixture<DesignatBlockModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DesignatBlockModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DesignatBlockModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
