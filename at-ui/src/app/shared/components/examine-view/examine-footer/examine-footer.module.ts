import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExaminaFooterComponent } from "./examine-footer.component";
import { AtSelectModule } from "../../at-select/at-select.module";
import { AtFeatherIconModule } from '../../feather-icons/feather-icons.module';

@NgModule({
  declarations: [
    ExaminaFooterComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtSelectModule,
    AtFeatherIconModule
  ],
  exports: [ExaminaFooterComponent]
})
export class AtExamineFooterModule { }
