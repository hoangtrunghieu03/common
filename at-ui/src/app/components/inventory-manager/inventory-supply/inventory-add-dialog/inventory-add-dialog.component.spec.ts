import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryAddDialogComponent } from './inventory-add-dialog.component';

describe('InventoryAddDialogComponent', () => {
  let component: InventoryAddDialogComponent;
  let fixture: ComponentFixture<InventoryAddDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryAddDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
