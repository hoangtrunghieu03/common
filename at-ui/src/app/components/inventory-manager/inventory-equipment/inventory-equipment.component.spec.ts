import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryEquipmentComponent } from './inventory-equipment.component';

describe('InventoryEquipmentComponent', () => {
  let component: InventoryEquipmentComponent;
  let fixture: ComponentFixture<InventoryEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
