import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputDelaySearchComponent } from './input-delay-search.component';

describe('InputDelaySearchComponent', () => {
  let component: InputDelaySearchComponent;
  let fixture: ComponentFixture<InputDelaySearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputDelaySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputDelaySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
