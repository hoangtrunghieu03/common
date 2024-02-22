import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtBaseTableModule } from '../../at-base-table/at-base-table.module';
import { DesignatComponent } from "./designat.component";
import { ATDirectivesModule } from '../../../directives/directives.module';
import { AtFeatherIconModule } from '../../feather-icons/feather-icons.module';

@NgModule({
  declarations: [
    DesignatComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtBaseTableModule,
    ATDirectivesModule,
    AtFeatherIconModule
  ],
  exports: [DesignatComponent]
})
export class AtDesignatModule { }
