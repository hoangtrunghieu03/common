import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InventoryTotalComponent } from './inventory/inventory-total/inventory-total.component';
import { OverviewDetailComponent } from './revenue/overview/overview-detail/overview-detail.component';
import { OverviewComponent } from './revenue/overview/overview.component';
import { RevenueComponent } from './revenue/revenue.component';
import { RoomComponent } from './revenue/room/room.component';
import { ServiceComponent } from './revenue/service/service.component';
import { StaffDetailComponent } from "./staff-report/staff-detail/staff-detail.component";
import { StaffReportComponent } from "./staff-report/staff-report.component";
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryByRoomComponent } from './inventory/inventory-by-room/inventory-by-room.component';
import { InventoryByRoomDetailComponent } from './inventory/inventory-by-room-detail/inventory-by-room-detail.component';

const routes: Routes = [
  {
    path: 'doanh-thu',
    component: RevenueComponent,
    children: [
      {
        path: 'tong-quan',
        component: OverviewComponent,
        data: {
          title: "Doanh thu tổng quan",
          breadcrumb_one: 'Báo cáo',
          breadcrumb_two: 'Báo cáo doanh thu',
          breadcrumb: 'Doanh thu tổng quan'
        }
      },
      {
        path: 'tong-quan/:id',
        component: OverviewDetailComponent,
        data: {
          title: "Doanh thu theo ngày",
          breadcrumb_one: 'Báo cáo',
          breadcrumb_two: 'Báo cáo doanh thu',
          breadcrumb: 'Doanh thu theo ngày'
        }
      },
      {
        path: 'dich-vu',
        component: ServiceComponent,
        data: {
          title: "Dịch vụ",
          breadcrumb_one: 'Báo cáo',
          breadcrumb_two: 'Báo cáo doanh thu',
          breadcrumb: 'Báo cáo dịch vụ'
        }
      },
      {
        path: 'phong',
        component: RoomComponent,
        data: {
          title: "Doanh thu theo phòng",
          breadcrumb_one: 'Báo cáo',
          breadcrumb_two: 'Báo cáo doanh thu',
          breadcrumb: 'Doanh thu theo phòng'
        }
      }
    ]
  },
  {
    path: 'nhan-vien',
    component: StaffReportComponent,
    data: {
      title: "Nhân viên",
      breadcrumb_one: 'Báo cáo',
      // breadcrumb_two: 'Báo cáo doanh thu',
      breadcrumb: 'Báo cáo nhân viên'
    }
  },
  {
    path: 'nhan-vien/:id',
    component: StaffDetailComponent,
    data: {
      title: "Nhân viên",
      breadcrumb_one: 'Báo cáo',
      breadcrumb_two: 'Nhân viên',
      // breadcrumb_three: 'Nhân viên',
      breadcrumb: 'Nhân viên cụ thể',
    }
  },
  {
    path: 'hang-ton',
    component: InventoryComponent,
    children: [
      {
        path: 'tong-kho',
        component: InventoryTotalComponent,
        data: {
          title: "Hàng tồn tổng kho",
          breadcrumb_one: 'Báo cáo',
          breadcrumb_two: 'Báo cáo hàng tồn',
          breadcrumb: 'Hàng tồn tổng kho'
        }
      },
      {
        path: 'theo-phong',
        component: InventoryByRoomComponent,
        data: {
          title: "Hàng tồn theo phòng",
          breadcrumb_one: 'Báo cáo',
          breadcrumb_two: 'Báo cáo hàng tồn',
          breadcrumb: 'Hàng tồn theo phòng'
        }
      },
      {
        path: 'theo-phong/:id',
        component: InventoryByRoomDetailComponent,
        data: {
          title: "Hàng tồn theo phòng",
          breadcrumb_one: 'Báo cáo',
          breadcrumb_two: 'Báo cáo hàng tồn',
          breadcrumb: 'Hàng tồn theo phòng'
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
