import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryDetailComponent } from './inventory-supply/inventory-detail/inventory-detail.component';
import { InventoryManagerComponent } from './inventory-manager.component';
import { InventorySupplyComponent } from './inventory-supply/inventory-supply.component';
import { InventoryEquipmentComponent } from './inventory-equipment/inventory-equipment.component';
import { EquipmentDetailComponent } from './inventory-equipment/equipment-detail/equipment-detail.component';
import { ExportHistoryComponent } from './export-history/export-history.component';
import { AdjustmentHistoryComponent } from './adjustment-history/adjustment-history.component';
import { ImportHistoryComponent } from './import-history/import-history.component';
import { InventorySupplyAdjustmentComponent } from './inventory-supply/inventory-supply-adjustment/inventory-supply-adjustment.component';
import { AttritionHistoryComponent } from './attrition-history/attrition-history.component';
import { ForwardingHistoryComponent } from './forwarding-history/forwarding-historycomponent';
import { InventorySupplyRequestComponent } from './inventory-supply/inventory-supply-request/inventory-supply-request.component';


const routes: Routes = [
  {
    path: '',
    component: InventoryManagerComponent,
    children: [

      {
        path: 'vat-dung/de-xuat',
        component: InventorySupplyRequestComponent,
        data: {
          title: "Danh sách đề xuất",
          breadcrumb_one: "Quản lý kho",
          breadcrumb_two: "Vật dụng tiêu hao",
          breadcrumb: "Danh sách đề xuất",
        }
      },
      {
        path: 'vat-dung',
        component: InventorySupplyComponent,
        data: {
          title: "Vật dụng tiêu hao",
          breadcrumb: "Vật dụng tiêu hao",
          breadcrumb_one: "Quản lý kho",
        }
      },
      {
        path: 'vat-dung/:_id',
        component: InventoryDetailComponent,
        data: {
          title: "Thông tin vật dụng",
          breadcrumb_one: "Quản lý kho",
          breadcrumb_two: "Vật dụng tiêu hao",
          breadcrumb: "Thông tin vật dụng",
        }
      },
      {
        path: 'thiet-bi',
        component: InventoryEquipmentComponent,
        data: {
          title: "Trang thiết bị",
          breadcrumb: "Trang thiết bị",
          breadcrumb_one: "Quản lý kho",
        }
      },
      {
        path: 'thiet-bi/:_id',
        component: EquipmentDetailComponent,
        data: {
          title: "Thông tin trang thiết bị",
          breadcrumb_one: "Quản lý kho",
          breadcrumb_two: "Trang thiết bị",
          breadcrumb: "Thông tin trang thiết bị",
        }
      },
      {
        path: 'lich-su-nhap',
        component: ImportHistoryComponent,
        data: {
          title: "Lịch sử nhập",
          breadcrumb: "Lịch sử nhập",
          breadcrumb_one: "Quản lý kho"
        }
      },
      {
        path: 'lich-su-tieu-hao',
        component: AttritionHistoryComponent,
        data: {
          title: "Lịch sử tiêu hao",
          breadcrumb: "Lịch sử tiêu hao",
          breadcrumb_one: "Quản lý kho"
        }
      },
      {
        path: 'lich-su-dieu-chinh',
        component: AdjustmentHistoryComponent,
        data: {
          title: "Lịch sử điều chỉnh",
          breadcrumb: "Lịch sử điều chỉnh",
          breadcrumb_one: "Quản lý kho"
        }
      },
      {
        path: 'lich-su-xuat',
        component: ExportHistoryComponent,
        data: {
          title: "Lịch sử xuất",
          breadcrumb: "Lịch sử xuất",
          breadcrumb_one: "Quản lý kho"
        }
      },
      {
        path: 'lich-su-giao-nhan',
        component: ForwardingHistoryComponent,
        data: {
          title: "Lịch sử phiếu giao nhận",
          breadcrumb: "Lịch sử phiếu giao nhận",
          breadcrumb_one: "Quản lý kho"
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InventoryManagerRoutingModule { }
