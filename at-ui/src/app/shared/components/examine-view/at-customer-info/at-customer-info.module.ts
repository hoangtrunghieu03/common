import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtCustomerInfoComponent } from "./at-customer-info.component";

@NgModule({
  declarations: [
    AtCustomerInfoComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  exports: [AtCustomerInfoComponent]
})
export class AtCustomerInfoModule { }
