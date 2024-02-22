import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtCompleteComponent } from "./at-autocomplete";
import { ATDirectivesModule } from "../../directives/directives.module";

@NgModule({
  declarations: [
    AtCompleteComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ATDirectivesModule
  ],
  exports: [AtCompleteComponent]
})
export class AtCompleteModule { }
