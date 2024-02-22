import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AtToothDiagramComponent } from './at-tooth-diagram.component';

describe('AtToothDiagramComponent', () => {
  let component: AtToothDiagramComponent;
  let fixture: ComponentFixture<AtToothDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AtToothDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AtToothDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
