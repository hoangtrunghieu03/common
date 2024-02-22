import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtDataAccessComponent } from "./at-data-access.component";

@NgModule({
  declarations: [
    AtDataAccessComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [AtDataAccessComponent]
})
export class AtDataAccessModule { }
