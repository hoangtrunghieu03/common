import { InventoryTotalComponent } from './inventory-total.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';


describe('InventoryTotalComponent', () => {
  let component: InventoryTotalComponent;
  let fixture: ComponentFixture<InventoryTotalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryTotalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryTotalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
