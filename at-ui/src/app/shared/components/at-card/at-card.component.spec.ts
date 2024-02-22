import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtCardComponent } from './at-card.component';

describe('AtCardComponent', () => {
  let component: AtCardComponent;
  let fixture: ComponentFixture<AtCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
