import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtRadioComponent } from './at-radio.component';

describe('AtRadioComponent', () => {
  let component: AtRadioComponent;
  let fixture: ComponentFixture<AtRadioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtRadioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtRadioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
