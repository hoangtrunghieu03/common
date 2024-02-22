import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReceiveComponent } from "./receive.component";
import { RouterModule, Routes } from '@angular/router';
import { CanDeactivateGuard } from 'src/app/shared/routes/can-deactivate.guard';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { AtInputModule } from "../../shared/components/at-input/at-input.module";
import { AtCompleteModule } from "../../shared/components/at-autocomplete/at-autocomplete.module";
import { AtCardModule } from "../../shared/components/at-card/at-card.module";
import { AtSelectModule } from "../../shared/components/at-select/at-select.module";
import { AtBaseTableModule } from "../../shared/components/at-base-table/at-base-table.module";
import { AtDatePickerModule } from "../../shared/components/at-datepicker/at-datepicker.module";
import { AtExamineFooterModule } from "../../shared/components/examine-view/examine-footer/examine-footer.module";
import { AtDesignatModalModule } from "../../shared/modal/designat-modal/designat-modal.module";
import { AtInputDelaySearchModule } from 'src/app/shared/components/input-delay-search/input-delay-search.module';
import { ATDirectivesModule } from 'src/app/shared/directives/directives.module';
import { AtServiceRequestModule } from '../../shared/components/examine-view/service-request/service-request.module';

const routes: Routes = [
    {
        path: '',
        component: ReceiveComponent,
        canDeactivate: [CanDeactivateGuard],
        data: {
          title: "Thông tin bệnh nhân",
          breadcrumb: "Thông tin bệnh nhân"
        }
    }
]
@NgModule({
  declarations: [
    ReceiveComponent
    ],
  imports: [
    CommonModule,
    NgxDatatableModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    RouterModule.forChild(routes),
    AtInputModule,
    AtCompleteModule,
    AtCardModule,
    AtSelectModule,
    AtBaseTableModule,
    AtDatePickerModule,
    AtExamineFooterModule,
    AtDesignatModalModule,
    AtInputDelaySearchModule,
    ATDirectivesModule,
    AtServiceRequestModule
  ],
  providers: [DestroySubsribeService]
})
export class ReceiveModule { }
