import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtBaseTableComponent } from "./at-base-table.component";
import { AtFeatherIconModule } from "../feather-icons/feather-icons.module";
import { ATDirectivesModule } from "../../directives/directives.module";

@NgModule({
  declarations: [
    AtBaseTableComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtFeatherIconModule,
    ATDirectivesModule
  ],
  exports: [AtBaseTableComponent]
})
export class AtBaseTableModule { }
