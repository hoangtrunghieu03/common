import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffsComponent } from './staffs.component';
import { StaffsRoutingModule } from "./staffs-routing.module";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StaffFormComponent } from './staff-form/staff-form.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { AtDatePickerModule } from "../../shared/components/at-datepicker/at-datepicker.module";
import { AtFeatherIconModule } from "../../shared/components/feather-icons/feather-icons.module";
import { AtSelectModule } from "../../shared/components/at-select/at-select.module";
import { AtDataAccessModule } from "../../shared/components/at-data-access/at-data-access.module";
import { ATDirectivesModule } from "../../shared/directives/directives.module";
import { AtInputDelaySearchModule } from "../../shared/components/input-delay-search/input-delay-search.module";
import { AtTableModule } from "../../shared/components/at-table/at-table.module";
import { AtInputModule } from "../../shared/components/at-input/at-input.module";
import { AtExamineFooterModule } from 'src/app/shared/components/examine-view/examine-footer/examine-footer.module';
import { AtFilterViewModule } from "../../shared/components/at-filter-view/at-filter-view.module"

@NgModule({
  declarations: [StaffsComponent, StaffFormComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    StaffsRoutingModule,
    AtDatePickerModule,
    AtFeatherIconModule,
    AtSelectModule,
    ATDirectivesModule,
    AtDataAccessModule,
    AtInputDelaySearchModule,
    AtTableModule,
    AtInputModule,
    AtExamineFooterModule,
    AtFilterViewModule,
  ],
  providers: [DestroySubsribeService]
})
export class StaffsModule { }
