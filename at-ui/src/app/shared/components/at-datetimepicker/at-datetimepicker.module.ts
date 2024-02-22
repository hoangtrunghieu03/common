import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtFeatherIconModule } from '../feather-icons/feather-icons.module';
import { DateTimePickerComponent } from './at-datetimepicker.component';

@NgModule({
  declarations: [
    DateTimePickerComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtFeatherIconModule
  ],
  exports: [DateTimePickerComponent]
})
export class AtDateTimePickerModule { }