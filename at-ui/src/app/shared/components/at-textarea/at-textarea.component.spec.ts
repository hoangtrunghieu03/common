import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtTextareaComponent } from './at-textarea.component';

describe('AtTextareaComponent', () => {
  let component: AtTextareaComponent;
  let fixture: ComponentFixture<AtTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
