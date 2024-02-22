import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeeComponent } from "./fee.component";
import { AtBaseTableModule } from "../../at-base-table/at-base-table.module";

@NgModule({
  declarations: [
    FeeComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtBaseTableModule
  ],
  exports: [FeeComponent]
})
export class AtFeeModule { }
