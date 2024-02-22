import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtFilterViewComponent } from './at-filter-view.component';

describe('AtFilterViewComponent', () => {
  let component: AtFilterViewComponent;
  let fixture: ComponentFixture<AtFilterViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtFilterViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtFilterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
