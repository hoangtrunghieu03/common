import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryByRoomDetailComponent } from './inventory-by-room-detail.component';

describe('InventoryByRoomDetailComponent', () => {
  let component: InventoryByRoomDetailComponent;
  let fixture: ComponentFixture<InventoryByRoomDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryByRoomDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryByRoomDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
