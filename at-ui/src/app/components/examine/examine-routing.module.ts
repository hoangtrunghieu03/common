import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReceptionComponent } from './reception/reception.component';
import { BracesComponent } from './braces/braces.component';
import { DesignatComponent } from './designat/designat.component';
import { GeneralComponent } from './general/general.component';
import { ImplantComponent } from './implant/implant.component';
import { MinorsurgeryComponent } from './minorsurgery/minorsurgery.component';
import { GeneralDetailComponent } from './general/general-detail/general-detail.component';
import { DesignatDetailComponent } from './designat/designat-detail/designat-detail.component';
import { BowMakingListComponent } from './designat/bow-making-list/bow-making-list.component';
import { MinorsurgeryDetailComponent } from './minorsurgery/minorsurgery-detail/minorsurgery-detail.component';
import { ImplantDetailComponent } from './implant/implant-detail/implant-detail.component';
import { ReceptionDetailComponent } from './reception/reception-detail/reception-detail.component';
import { BracesDetailComponent } from './braces/braces-detail/braces-detail.component';
import { GeneralMedicalRecordComponent } from './general/general-medical-record/general-medical-record.component';
import { ImplantMedicalRecordComponent } from './implant/implant-medical-record/implant-medical-record.component';
import { BracesMedicalRecordComponent } from './braces/braces-medical-record/braces-medical-record.component';
import DeactivateGuard from 'src/app/shared/directives/deactive-guard';
import { MedicalSupplyListComponent } from '../inventory-manager/inventory-supply/medical-supply-list/medical-supply-list.component';
import { BowMakingReceptionComponent } from './reception/bow-making-reception/bow-making-reception.component';
import { BowMakingGeneralComponent } from './general/bow-making-general/bow-making-general.component';

const routes: Routes = [
    {
        path: '',
        children: [

            {
                path: 'phong-tiep-tan/danh-sach-vat-dung',
                component: MedicalSupplyListComponent,
                data: {
                  title: "Danh sách vật dụng",
                  breadcrumb_one: "Khám bệnh",
                  breadcrumb_two: "Danh sách vật dụng",
                }
            },
            {
              path: 'phong-tong-quat/danh-sach-vat-dung',
              component: MedicalSupplyListComponent,
              data: {
                title: "Danh sách vật dụng",
                breadcrumb_one: "Khám bệnh",
                breadcrumb_two: "Danh sách vật dụng",
              }
            },
            {
              path: 'phong-chi-dinh/danh-sach-vat-dung',
              component: MedicalSupplyListComponent,
              data: {
                title: "Danh sách vật dụng",
                breadcrumb_one: "Khám bệnh",
                breadcrumb_two: "Danh sách vật dụng",
              }
            },
            {
              path: 'phong-nieng-rang/danh-sach-vat-dung',
              component: MedicalSupplyListComponent,
              data: {
                title: "Danh sách vật dụng",
                breadcrumb_one: "Khám bệnh",
                breadcrumb_two: "Danh sách vật dụng",
              }
            },
            {
              path: 'phong-tieu-phau/danh-sach-vat-dung',
              component: MedicalSupplyListComponent,
              data: {
                title: "Danh sách vật dụng",
                breadcrumb_one: "Khám bệnh",
                breadcrumb_two: "Danh sách vật dụng",
              }
            },
            {
              path: 'phong-cay-implant/danh-sach-vat-dung',
              component: MedicalSupplyListComponent,
              data: {
                title: "Danh sách vật dụng",
                breadcrumb_one: "Khám bệnh",
                breadcrumb_two: "Danh sách vật dụng",
              }
            },
            {
                path: 'phong-tiep-tan/:_id',
                component: ReceptionDetailComponent,
                data: {
                    title: "Thông tin bệnh nhân",
                    breadcrumb_two: "Phòng Tiếp Tân",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Thông tin bệnh nhân",
                }
            },
            {
                path: 'phong-tiep-tan',
                component: ReceptionComponent,
                data: {
                    title: "Phòng tiếp tân",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Phòng tiếp tân"
                }
            },
            {
                path: 'phong-tiep-tan/lam-cung/:id',
                component: BowMakingReceptionComponent,
                data: {
                    title: "Phòng tiếp tân",
                    breadcrumb_two: "Phòng tiếp tân",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Danh sách làm cung",
                }
            },
            {
                path: 'phong-nieng-rang/:_Id',
                component: BracesDetailComponent,
                data: {
                    title: "Bệnh án phòng niềng răng",
                    breadcrumb_two: "Phòng niềng răng",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Thông tin bệnh nhân",
                },
                canDeactivate: [DeactivateGuard]
            },
            {
                path: 'phong-nieng-rang',
                component: BracesComponent,
                data: {
                    title: "Phòng niềng răng",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Phòng niềng răng"
                }
            },
            {
                path: 'phong-nieng-rang/chi-tiet/:_id',
                component: BracesMedicalRecordComponent,
                data: {
                    title: "Bệnh án phòng niềng răng",
                    breadcrumb_two: "Phòng niềng răng",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Thông tin bệnh nhân",
                }
            },
            {
                path: 'phong-chi-dinh/:id',
                component: DesignatDetailComponent,
                data: {
                    title: "Bệnh án phòng chỉ định",
                    breadcrumb_two: "Phòng chỉ định",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Thông tin bệnh nhân",
                }
            },
            {
                path: 'phong-chi-dinh/lam-cung/:id',
                component: BowMakingListComponent,
                data: {
                    title: "Phòng chỉ định",
                    breadcrumb_two: "Phòng chỉ định",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Danh sách làm cung",
                }
            },
            {
                path: 'phong-tong-quat/lam-cung/:id',
                component: BowMakingGeneralComponent,
                data: {
                    title: "Phòng tổng quát",
                    breadcrumb_two: "Phòng tổng quát",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Danh sách làm cung",
                }
            },
            {
                path: 'phong-nieng-rang/lam-cung/:id',
                component: BowMakingGeneralComponent,
                data: {
                    title: "Phòng niềng răng",
                    breadcrumb_two: "Phòng niềng răng",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Danh sách làm cung",
                }
            },
            {
                path: 'phong-chi-dinh',
                component: DesignatComponent,
                data: {
                    title: "Phòng chỉ định",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Phòng chỉ định"
                },
            },
            {
                path: 'phong-tong-quat/chi-tiet/:_id',
                component: GeneralMedicalRecordComponent,
                data: {
                    title: "Bệnh án phòng Tổng quát",
                    breadcrumb_two: "Phòng Tổng quát",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Thông tin bệnh nhân",
                }
            },
            {
                path: 'phong-tong-quat/:_id',
                component: GeneralDetailComponent,
                data: {
                    title: "Bệnh án phòng Tổng quát",
                    breadcrumb_two: "Phòng tổng quát",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Thông tin bệnh nhân",
                },
                canDeactivate: [DeactivateGuard]
            },
            {
                path: 'phong-tong-quat',
                component: GeneralComponent,
                data: {
                    title: "Phòng Tổng quát",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Phòng tổng quát"
                }
            },
            {
                path: 'phong-cay-implant/chi-tiet/:_id',
                component: ImplantMedicalRecordComponent,
                data: {
                    title: "Bệnh án phòng cấy Implant",
                    breadcrumb_two: "Phòng cấy Implant",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Thông tin bệnh nhân",
                }
            },
            {
                path: 'phong-cay-implant/:_id',
                component: ImplantDetailComponent,
                data: {
                    title: "Bệnh án phòng cấy Implant",
                    breadcrumb_two: "Phòng cấy Implant",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Thông tin bệnh nhân",
                },
                canDeactivate: [DeactivateGuard]
            },
            {
                path: 'phong-cay-implant',
                component: ImplantComponent,
                data: {
                    title: "Phòng cấy Implant",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Phòng cấy Implant"
                }
            },
            {
                path: 'phong-tieu-phau/:_id',
                component: MinorsurgeryDetailComponent,
                data: {
                    title: "Bệnh án phòng tiểu phẫu",
                    breadcrumb_two: "Phòng tiểu phẫu",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Thông tin bệnh nhân",
                }
            },
            {
                path: 'phong-tieu-phau',
                component: MinorsurgeryComponent,
                data: {
                    title: "Phòng tiểu phẫu",
                    breadcrumb_one: "Khám bệnh",
                    breadcrumb: "Phòng tiểu phẫu"
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ExamineRoutingModule { }
