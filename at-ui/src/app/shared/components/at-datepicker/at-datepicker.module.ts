import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtDatepickerComponent } from "./at-datepicker.component";

@NgModule({
  declarations: [
    AtDatepickerComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [AtDatepickerComponent]
})
export class AtDatePickerModule { }
