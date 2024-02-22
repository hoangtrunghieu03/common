import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';
import { AppointmentScheduleComponent } from './appointment-schedule.component';
import { AppointmentConfirmInfoComponent } from './appointment-confirm-info/appointment-confirm-info.component';


const routes: Routes = [
  {
    path: '',
    component: AppointmentScheduleComponent,
    data: {
      title: "Lịch hẹn",
      breadcrumb: "Lịch hẹn"
    }
  },
  {
    path: ':_id',
    component: AppointmentDetailComponent,
    data: {
      title: "Chi tiết lịch hẹn",
      breadcrumb_one: "Lịch hẹn",
      breadcrumb: "Chi tiết lịch hẹn",
    }
  },
  {
    path: 'confirm/:id',
    component: AppointmentConfirmInfoComponent,
    data: {
      title: "Xác nhận lịch hẹn",
      breadcrumb_one: "Lịch hẹn",
      breadcrumb: "Xác nhận lịch hẹn",
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppointmentScheduleRoutingModule { }
