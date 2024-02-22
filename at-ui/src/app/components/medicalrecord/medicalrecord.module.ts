import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MedicalrecordComponent } from './medicalrecord.component';
import { MedicalrecordRoutingModule } from "./medicalrecord-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MedicalrecordDetailComponent } from './medicalrecord-detail/medicalrecord-detail.component';
import { GeneralInfoComponent } from './medicalrecord-detail/general-info/general-info.component';
import { HistoryComponent } from './medicalrecord-detail/history/history.component';
import { AtFeatherIconModule } from "../../shared/components/feather-icons/feather-icons.module";
import { AtBaseTableModule } from "../../shared/components/at-base-table/at-base-table.module";
import { AtPicktureModule } from "../../shared/components/examine-view/pickture/at-picture.module";
import { AtServiceModule } from "../../shared/components/examine-view/service/at-service.module";
import { AtTreatmentModule } from "../../shared/components/examine-view/treatment/at-treatment.module";
import { AtPatientModule } from "../../shared/components/examine-view/patient/at-patient.module";
import { AtFeeModule } from "../../shared/components/examine-view/fee/at-fee.module";
import { AtTableModule } from "../../shared/components/at-table/at-table.module";
import { AtInputDelaySearchModule } from "../../shared/components/input-delay-search/input-delay-search.module";
import { AtSelectModule } from 'src/app/shared/components/at-select/at-select.module';
import { AtInputModule } from 'src/app/shared/components/at-input/at-input.module';
import { AtDatePickerModule } from 'src/app/shared/components/at-datepicker/at-datepicker.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ExamineModule } from '../examine/examine.mudule';
import { AtExamineFooterModule } from 'src/app/shared/components/examine-view/examine-footer/examine-footer.module';
import { AtFilterViewModule } from '../../shared/components/at-filter-view/at-filter-view.module';
import { HistoryDetailComponent } from './medicalrecord-detail/history-detail/history-detail.component';
import { AtCardModule } from '../../shared/components/at-card/at-card.module';
import { AtToothDiagramModule } from '../../shared/components/examine-view/at-tooth-diagram/at-tooth-diagram.module';
import { ATDirectivesModule } from 'src/app/shared/directives/directives.module';
import { TreatmentDetailComponent } from './medicalrecord-detail/treatment-detail/treatment-detail.component';
import { ATModalModule } from 'src/app/shared/modal/modal-common/modal.module';
import { PaymentHistoryModalComponent } from './medicalrecord-detail/payment-history-modal/payment-history-modal.component';
import { MedicalrecordBookComponent } from './medicalrecord-detail/medicalrecord-book/medicalrecord-book.component'

@NgModule({
  declarations: [
    MedicalrecordComponent,
    MedicalrecordDetailComponent,
    GeneralInfoComponent,
    HistoryComponent,
    HistoryDetailComponent,
    TreatmentDetailComponent,
    PaymentHistoryModalComponent,
    MedicalrecordBookComponent
  ],
  imports: [
    CommonModule,
    MedicalrecordRoutingModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtBaseTableModule,
    AtFeatherIconModule,
    AtServiceModule,
    AtTreatmentModule,
    AtPatientModule,
    AtPicktureModule,
    AtFeeModule,
    AtTableModule,
    AtInputDelaySearchModule,
    AtSelectModule,
    AtInputModule,
    AtDatePickerModule,
    NgxDatatableModule,
    ExamineModule,
    AtExamineFooterModule,
    AtFilterViewModule,
    AtCardModule,
    AtToothDiagramModule,
    ATDirectivesModule,
    AtTreatmentModule,
    ATModalModule
  ],
  providers: [DatePipe]
})
export class MedicalrecordModule { }
