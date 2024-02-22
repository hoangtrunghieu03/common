import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtDatePickerModule } from '../../components/at-datepicker/at-datepicker.module';
import { AtInputModule } from '../../components/at-input/at-input.module';
import { AtDesignatModule } from "../../components/examine-view/designat/designat.module";
import { ScheduleModalComponent } from './schedule-modal.component';
import { AtDateTimePickerModule } from '../../components/at-datetimepicker/at-datetimepicker.module';
import { AtCompleteModule } from '../../components/at-autocomplete/at-autocomplete.module';
import { ATDirectivesModule } from '../../directives/directives.module';
import { AtInputDelaySearchModule } from '../../components/input-delay-search/input-delay-search.module';
import { RouterModule } from '@angular/router';
import { AtServiceRequestModule } from '../../components/examine-view/service-request/service-request.module';
import { AtSelectModule } from '../../components/at-select/at-select.module';

@NgModule({
  declarations: [
    ScheduleModalComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtDesignatModule,
    AtDatePickerModule,
    AtInputModule,
    AtDateTimePickerModule,
    AtCompleteModule,
    ATDirectivesModule,
    AtInputDelaySearchModule,
    AtServiceRequestModule,
    AtSelectModule
  ],
  exports: [ScheduleModalComponent]
})
export class AtAppointmentModalModule { }
