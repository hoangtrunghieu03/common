import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtCustomerInfoComponent } from './at-customer-info.component';

describe('AtCustomerInfoComponent', () => {
  let component: AtCustomerInfoComponent;
  let fixture: ComponentFixture<AtCustomerInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtCustomerInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtCustomerInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
