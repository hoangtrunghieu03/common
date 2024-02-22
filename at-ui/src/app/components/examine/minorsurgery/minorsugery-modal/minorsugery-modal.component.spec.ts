import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinorsugeryModalComponent } from './minorsugery-modal.component';

describe('MinorsugeryModalComponent', () => {
  let component: MinorsugeryModalComponent;
  let fixture: ComponentFixture<MinorsugeryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinorsugeryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinorsugeryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
