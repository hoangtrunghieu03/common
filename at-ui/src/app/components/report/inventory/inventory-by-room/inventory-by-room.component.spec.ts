import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryByRoomComponent } from './inventory-by-room.component';

describe('InventoryByRoomComponent', () => {
  let component: InventoryByRoomComponent;
  let fixture: ComponentFixture<InventoryByRoomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryByRoomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryByRoomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
