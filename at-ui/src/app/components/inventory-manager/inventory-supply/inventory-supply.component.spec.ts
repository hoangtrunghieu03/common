import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorySupplyComponent } from './inventory-supply.component';

describe('InventorySupplyComponent', () => {
  let component: InventorySupplyComponent;
  let fixture: ComponentFixture<InventorySupplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventorySupplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventorySupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
