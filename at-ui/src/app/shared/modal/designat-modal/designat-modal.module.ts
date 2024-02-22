import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DesignatModalComponent } from "./designat-modal.component";
import { AtDesignatModule } from "../../components/examine-view/designat/designat.module";
import { AtFeatherIconModule } from '../../components/feather-icons/feather-icons.module';
import { ATDirectivesModule } from '../../directives/directives.module';
import { AtInputDelaySearchModule } from '../../components/input-delay-search/input-delay-search.module';

@NgModule({
  declarations: [
    DesignatModalComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtFeatherIconModule,
    ATDirectivesModule,
    AtInputDelaySearchModule
  ],
  exports: [DesignatModalComponent]
})
export class AtDesignatModalModule { }
