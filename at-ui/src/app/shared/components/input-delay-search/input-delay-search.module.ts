import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputDelaySearchComponent } from "./input-delay-search.component";
import { AtFeatherIconModule } from "../feather-icons/feather-icons.module";

@NgModule({
  declarations: [
    InputDelaySearchComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtFeatherIconModule
  ],
  exports: [InputDelaySearchComponent]
})
export class AtInputDelaySearchModule { }
