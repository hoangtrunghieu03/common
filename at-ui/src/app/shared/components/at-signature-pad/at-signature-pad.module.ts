import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtSignaturePadComponent } from './at-signature-pad.component';

@NgModule({
  declarations: [
    AtSignaturePadComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [AtSignaturePadComponent]
})
export class AtSignaturePadModule { }
