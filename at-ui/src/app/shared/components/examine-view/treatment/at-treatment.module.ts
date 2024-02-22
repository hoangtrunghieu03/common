import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TreatmentComponent } from "./treatment.component";
import { AtFeatherIconModule } from "../../feather-icons/feather-icons.module";
import { ATDirectivesModule } from "../../../directives/directives.module";
import { AtAppointmentModalModule } from "../../../modal/schedule-modal/schedule-modal.module";
import { AtDateTimePickerModule } from '../../at-datetimepicker/at-datetimepicker.module';
import { TreatmentModalComponent } from './treatment-modal/treatment-modal.component';
import { AtDatePickerModule } from '../../at-datepicker/at-datepicker.module';
import { AtInputModule } from 'src/app/shared/components/at-input/at-input.module';
import { AtSelectModule } from 'src/app/shared/components/at-select/at-select.module';
import { AtServiceRequestModule } from '../service-request/service-request.module';
import { AtBaseTableModule } from '../../at-base-table/at-base-table.module';
import { AtInputDelaySearchModule } from 'src/app/shared/components/input-delay-search/input-delay-search.module';

@NgModule({
  declarations: [
    TreatmentComponent,
    TreatmentModalComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtFeatherIconModule,
    ATDirectivesModule,
    AtAppointmentModalModule,
    AtDateTimePickerModule,
    AtDatePickerModule,
    AtInputModule,
    AtSelectModule,
    AtServiceRequestModule,
    AtBaseTableModule,
    AtInputDelaySearchModule
  ],
  exports: [TreatmentComponent],
  providers: [TreatmentModalComponent]
})
export class AtTreatmentModule { }
