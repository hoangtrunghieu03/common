import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StaffFormComponent } from './staff-form/staff-form.component';
import { StaffsComponent } from './staffs.component';


const routes: Routes = [
  {
    path: '',
    component: StaffsComponent,
    data: {
      title: "Nhân viên",
      breadcrumb: "Nhân viên"
    }
  },
  {
    path: 'tao-moi',
    component: StaffFormComponent,
    data: {
      title: "Tạo mới nhân viên",
      breadcrumb_one: "Nhân viên",
      breadcrumb: "Tạo mới nhân viên",
    }
  },
  {
    path: ':_id',
    component: StaffFormComponent,
    data: {
      title: "Nhân viên",
      breadcrumb_one: "Nhân viên",
      breadcrumb: "Chi tiết nhân viên",
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StaffsRoutingModule { }
