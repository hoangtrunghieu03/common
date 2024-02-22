import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExamineRoutingModule } from "./examine-routing.module";
import { BracesComponent } from './braces/braces.component';
import { GeneralComponent } from './general/general.component';
import { ImplantComponent } from './implant/implant.component';
import { DesignatComponent } from './designat/designat.component';
import { MinorsurgeryComponent } from './minorsurgery/minorsurgery.component';
import { ReceptionComponent } from './reception/reception.component';
import { SharedModule } from "../../shared/shared.module";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GeneralDetailComponent } from './general/general-detail/general-detail.component';
import { DesignatDetailComponent } from "./designat/designat-detail/designat-detail.component";
import { DesignatServiceComponent } from "./designat/designat-detail/designat-service/designat-service.component";
import { MinorsurgeryDetailComponent } from './minorsurgery/minorsurgery-detail/minorsurgery-detail.component';
import { ImplantDetailComponent } from "./implant/implant-detail/implant-detail.component";
import { ReceptionDetailComponent } from "./reception/reception-detail/reception-detail.component";
import { BracesDetailComponent } from './braces/braces-detail/braces-detail.component';
import { BracesPatientComponent } from "./braces/braces-detail/patient/patient.component";
import { PicktureBracesComponent } from "./braces/braces-detail/pickture/pickture.component";
import { DesignatBlockModalComponent } from "./designat/designat-modal/designat-modal.component";
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { AtCardModule } from "../../shared/components/at-card/at-card.module";
import { GeneralMedicalRecordComponent } from './general/general-medical-record/general-medical-record.component';
import { AtFeatherIconModule } from "../../shared/components/feather-icons/feather-icons.module";
import { AtPictureBlockModule } from "../../shared/components/examine-view/picture-block/picture-block.module";
import { AtBaseTableModule } from "../../shared/components/at-base-table/at-base-table.module";
import { AtExamineFooterModule } from "../../shared/components/examine-view/examine-footer/examine-footer.module";
import { ATDirectivesModule } from "../../shared/directives/directives.module";
import { AtToothDiagramModule } from "../../shared/components/examine-view/at-tooth-diagram/at-tooth-diagram.module";
import { AtInputDelaySearchModule } from "../../shared/components/input-delay-search/input-delay-search.module";
import { AtTableModule } from "../../shared/components/at-table/at-table.module";
import { AtDesignatModule } from "../../shared/components/examine-view/designat/designat.module";
import { AtSelectModule } from "../../shared/components/at-select/at-select.module";
import { AtPaymentModalModule } from "../../shared/modal/payment-modal/payment-modal.module";
import { AtPicktureModule } from "../../shared/components/examine-view/pickture/at-picture.module";
import { AtServiceModule } from "../../shared/components/examine-view/service/at-service.module";
import { AtTreatmentModule } from "../../shared/components/examine-view/treatment/at-treatment.module";
import { AtFeeModule } from "../../shared/components/examine-view/fee/at-fee.module";
import { AtPatientModule } from "../../shared/components/examine-view/patient/at-patient.module";
import { AtChairModule } from "../../shared/components/examine-view/chair/at-chair.module";
import { AtFilterViewModule } from "../../shared/components/at-filter-view/at-filter-view.module";
import { AtDatePickerModule } from "../../shared/components/at-datepicker/at-datepicker.module";
import { AtCompleteModule } from "../../shared/components/at-autocomplete/at-autocomplete.module";
import { AtInputModule } from "../../shared/components/at-input/at-input.module";
import { MinorsugeryModalComponent } from './minorsurgery/minorsugery-modal/minorsugery-modal.component';
import { AtCustomerInfoModule } from "../../shared/components/examine-view/at-customer-info/at-customer-info.module";
import { ATModalModule } from "../../shared/modal/modal-common/modal.module";
import { AtTextareaModule } from "../../shared/components/at-textarea/at-textarea.module";
import { ImplantMedicalRecordComponent } from './implant/implant-medical-record/implant-medical-record.component';
import { BracesMedicalRecordComponent } from './braces/braces-medical-record/braces-medical-record.component';
import { UploadImageService } from 'src/app/store/services/uploadImages.service';
import { AtExamineListModule } from '../../shared/components/examine-view/examine-list/examine-list.module';
import DeactivateGuard from 'src/app/shared/directives/deactive-guard';
import { ChairSettingModule } from '../chair-setting/chair-setting.module';
import { BowMakingListComponent } from './designat/bow-making-list/bow-making-list.component';
import { BowMakingReceptionComponent } from './reception/bow-making-reception/bow-making-reception.component';
import { BowMakingGeneralComponent } from './general/bow-making-general/bow-making-general.component';

@NgModule({
  declarations: [
      BracesComponent,
      GeneralComponent,
      ImplantComponent,
      DesignatComponent,
      MinorsurgeryComponent,
      ReceptionComponent,
      GeneralDetailComponent,
      DesignatDetailComponent,
      DesignatServiceComponent,
      MinorsurgeryDetailComponent,
      ImplantDetailComponent,
      ReceptionDetailComponent,
      BracesDetailComponent,
      BracesPatientComponent,
      PicktureBracesComponent,
      DesignatBlockModalComponent,
      GeneralMedicalRecordComponent,
      MinorsugeryModalComponent,
      ImplantMedicalRecordComponent,
      BracesMedicalRecordComponent,
      BowMakingListComponent,
      BowMakingReceptionComponent,
      BowMakingGeneralComponent
    ],
  imports: [
    CommonModule,
    ExamineRoutingModule,
    // SharedModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AtCardModule,
    AtFeatherIconModule,
    AtPictureBlockModule,
    AtBaseTableModule,
    AtExamineFooterModule,
    ATDirectivesModule,
    AtToothDiagramModule,
    AtInputDelaySearchModule,
    AtTableModule,
    AtDesignatModule,
    AtSelectModule,
    AtPaymentModalModule,
    AtPicktureModule,
    AtServiceModule,
    AtTreatmentModule,
    AtFeeModule,
    AtPatientModule,
    AtFilterViewModule,
    AtDatePickerModule,
    AtCompleteModule,
    AtInputModule,
    AtCustomerInfoModule,
    ATModalModule,
    AtTextareaModule,
    AtChairModule,
    AtExamineListModule,
    ChairSettingModule
  ],
  providers: [DestroySubsribeService, UploadImageService, DeactivateGuard]
})
export class ExamineModule { }
