import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtInputComponent } from "./at-input.component";
import { ATDirectivesModule } from "../../directives/directives.module";

@NgModule({
  declarations: [
    AtInputComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ATDirectivesModule
  ],
  exports: [AtInputComponent]
})
export class AtInputModule { }
