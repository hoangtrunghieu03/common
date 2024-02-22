import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PaymentModalComponent } from "./payment-modal.component";
import { ATDirectivesModule } from "../../directives/directives.module";
import { AtInputModule } from "../../components/at-input/at-input.module";
import { AtBaseTableModule } from "../../components/at-base-table/at-base-table.module";
import { AtFeeModule } from "../../components/examine-view/fee/at-fee.module";
import { ATModalModule } from "../modal-common/modal.module";
import { AtSelectModule } from '../../components/at-select/at-select.module';
import { AtDatePickerModule } from '../../components/at-datepicker/at-datepicker.module';

@NgModule({
  declarations: [
    PaymentModalComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ATDirectivesModule,
    AtInputModule,
    AtBaseTableModule,
    AtFeeModule,
    ATModalModule,
    AtSelectModule,
    AtDatePickerModule
  ],
  exports: [PaymentModalComponent]
})
export class AtPaymentModalModule { }
