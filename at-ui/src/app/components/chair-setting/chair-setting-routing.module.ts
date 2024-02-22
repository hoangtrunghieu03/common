import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChairSettingDetailComponent } from './chair-setting-detail/chair-setting-detail.component';
import { ChairSettingComponent } from './chair-setting.component';

const routes: Routes = [
  {
    path: '',
    component: ChairSettingComponent,
    data: {
      title: "Quản lí ghế",
      breadcrumb: "Quản lí ghế"
    }
  },
  {
    path: ':_id',
    component: ChairSettingDetailComponent,
    data: {
      title: "Cập nhật ghế",
      breadcrumb_one: "Quản lí ghế",
      breadcrumb: "Cập nhật ghế",
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ChairSettingRoutingModule { }
