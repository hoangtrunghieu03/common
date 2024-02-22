import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HistoryDetailComponent } from './medicalrecord-detail/history-detail/history-detail.component';
import { MedicalrecordDetailComponent } from './medicalrecord-detail/medicalrecord-detail.component';
import { TreatmentDetailComponent } from './medicalrecord-detail/treatment-detail/treatment-detail.component';
import { MedicalrecordComponent } from './medicalrecord.component';

const routes: Routes = [
  {
    path: '',
    component: MedicalrecordComponent,
    data: {
      title: "Hồ sơ bệnh án",
      breadcrumb: "Hồ sơ bệnh án"
    },
  },
  {
    path: ':_id',
    component: MedicalrecordDetailComponent,
    data: {
      title: "Hồ sơ bệnh án",
      breadcrumb_one: "Hồ sơ bệnh án",
      breadcrumb: "Thông tin bệnh án",
    }
  },
  {
    path: 'chi-tiet/:_id',
    component: HistoryDetailComponent,
    data: {
      title: "Hồ sơ bệnh án",
      breadcrumb_one: "Hồ sơ bệnh án",
      breadcrumb: "Thông tin bệnh án",
    }
  },
  {
    path: 'lich-su/:_id',
    component: TreatmentDetailComponent,
    data: {
      title: "Lịch sử điều trị",
      breadcrumb_one: "Hồ sơ bệnh án",
      breadcrumb_two: "Thông tin bệnh án",
      breadcrumb: "Lịch sử điều trị",
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class MedicalrecordRoutingModule { }
