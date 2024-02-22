import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingComboComponent } from "./setting-combo/setting-combo.component";
import { SettingRoleDetailComponent } from './setting-role/setting-role-detail/setting-role-detail.component';
import { SettingRoleComponent } from "./setting-role/setting-role.component";
import { ServiceDetailComponent } from './setting-service/service-detail/service-detail.component';
import { SettingServiceComponent } from "./setting-service/setting-service.component";
import { SettingAllocateComponent } from "./setting-allocate/setting-allocate.component";
import { AllocateDetailComponent } from './setting-allocate/allocate-detail/allocate-detail.component';
import { SettingComboDetailComponent } from './setting-combo/setting-combo-detail/setting-combo-detail.component';
import { SettingPrintComponent } from './setting-print/setting-print.component';
import { SettingZaloComponent } from './setting-zalo/setting-zalo.component';


const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'dich-vu',
        component: SettingServiceComponent,
        data: {
          title: "Dịch vụ",
          breadcrumb: "Dịch vụ",
          breadcrumb_one: "Cài đặt",
        }
      },
      {
        path: 'dich-vu/:_id',
        component: ServiceDetailComponent,
        data: {
          title: "Dịch vụ",
          breadcrumb_two: "Dịch vụ",
          breadcrumb_one: "Cài đặt",
          breadcrumb: "Chi tiết dịch vụ",
        }
      },
      {
        path: 'combo-chi-dinh',
        component: SettingComboComponent,
        data: {
          title: "Combo chỉ định",
          breadcrumb: "Combo chỉ định",
          breadcrumb_one: "Cài đặt",
        }
      },
      {
        path: 'combo-chi-dinh/tao-moi',
        component: SettingComboDetailComponent,
        data: {
          title: "Thêm combo chỉ định",
          breadcrumb_two: "Combo chỉ định",
          breadcrumb_one: "Cài đặt",
          breadcrumb: "Thêm combo chỉ định",
        }
      },
      {
        path: 'combo-chi-dinh/:_id',
        component: SettingComboDetailComponent,
        data: {
          title: "Chi tiết combo chỉ định",
          breadcrumb_two: "Combo chỉ định",
          breadcrumb_one: "Cài đặt",
          breadcrumb: "Chi tiết combo chỉ định",
        }
      },
      {
        path: 'chi-dinh',
        component: SettingAllocateComponent,
        data: {
          title: "Chỉ định",
          breadcrumb: "Chỉ định",
          breadcrumb_one: "Cài đặt",
        }
      },
      {
        path: 'chi-dinh/:_id',
        component: AllocateDetailComponent,
        data: {
          title: "Chỉ định",
          breadcrumb_two: "Chỉ định",
          breadcrumb_one: "Cài đặt",
          breadcrumb: "Chi tiết chỉ định",
        }
      },
      {
        path: 'phan-quyen',
        component: SettingRoleComponent,
        data: {
          title: "Phân quyền",
          breadcrumb: "Phân quyền",
          breadcrumb_one: "Cài đặt",
        }
      },
      {
        path: 'phan-quyen/tao-moi',
        component: SettingRoleDetailComponent,
        data: {
          title: "Thêm vai trò",
          breadcrumb_two: "Phân quyền",
          breadcrumb_one: "Cài đặt",
          breadcrumb: "Thêm vai trò",
        }
      },
      {
        path: 'phan-quyen/:_id',
        component: SettingRoleDetailComponent,
        data: {
          title: "Chi tiết vai trò",
          breadcrumb_two: "Phân quyền",
          breadcrumb_one: "Cài đặt",
          breadcrumb: "Chi tiết vai trò",
        }
      },
      {
        path: 'phieu-in',
        component: SettingPrintComponent,
        data: {
          title: "Phiếu in",
          breadcrumb: "Phiếu in",
          breadcrumb_one: "Cài đặt",
        }
      },
      {
        path: 'zalo',
        component: SettingZaloComponent,
        data: {
          title: "Zalo",
          breadcrumb: "Zalo",
          breadcrumb_one: "Cài đặt",
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
