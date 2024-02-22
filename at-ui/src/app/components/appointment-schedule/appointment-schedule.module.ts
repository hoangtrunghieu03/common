import { AppointmentConfirmDialogComponent } from './appointment-confirm-dialog/appointment-confirm-dialog.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentScheduleComponent } from './appointment-schedule.component';
import { AppointmentScheduleRoutingModule } from "./appointment-schedule.routing";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppointmentAddDialogComponent } from './appointment-add-dialog/appointment-add-dialog.component';
import { AppointmentDetailComponent } from './appointment-detail/appointment-detail.component';
import { AtDatePickerModule } from "../../shared/components/at-datepicker/at-datepicker.module";
import { AtCompleteModule } from "../../shared/components/at-autocomplete/at-autocomplete.module";
import { AtBaseTableModule } from "../../shared/components/at-base-table/at-base-table.module";
import { AtInputModule } from "../../shared/components/at-input/at-input.module";
import { AtExamineFooterModule } from "../../shared/components/examine-view/examine-footer/examine-footer.module";
import { AtInputDelaySearchModule } from "../../shared/components/input-delay-search/input-delay-search.module";
import { AtTableModule } from "../../shared/components/at-table/at-table.module";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AtFeatherIconModule } from 'src/app/shared/components/feather-icons/feather-icons.module';
import { AtDateTimePickerModule } from 'src/app/shared/components/at-datetimepicker/at-datetimepicker.module';
import { AtFilterViewModule } from "../../shared/components/at-filter-view/at-filter-view.module"
import { AtServiceRequestModule } from '../../shared/components/examine-view/service-request/service-request.module';
import { AtSelectModule } from '../../shared/components/at-select/at-select.module';
import { ATDirectivesModule } from '../../shared/directives/directives.module';
import { AppointmentScheduleQRComponent } from './appointment-schedule-qr/appointment-schedule-qr.component';
import { AppointmentConfirmInfoComponent } from './appointment-confirm-info/appointment-confirm-info.component';

@NgModule({
  declarations: [AppointmentScheduleComponent, AppointmentAddDialogComponent, AppointmentDetailComponent, AppointmentScheduleQRComponent, AppointmentConfirmDialogComponent, AppointmentConfirmInfoComponent],
  imports: [
    CommonModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AppointmentScheduleRoutingModule,
    AtDatePickerModule,
    AtCompleteModule,
    AtBaseTableModule,
    AtInputModule,
    AtExamineFooterModule,
    AtInputDelaySearchModule,
    AtTableModule,
    NgxDatatableModule,
    AtFeatherIconModule,
    AtDateTimePickerModule,
    AtFilterViewModule,
    AtServiceRequestModule,
    AtSelectModule,
    ATDirectivesModule
  ]
})
export class AppointmentScheduleModule { }
