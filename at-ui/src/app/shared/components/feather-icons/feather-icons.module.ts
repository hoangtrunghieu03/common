import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FeatherIconsComponent } from "./feather-icons.component";

@NgModule({
  declarations: [
    FeatherIconsComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [FeatherIconsComponent]
})
export class AtFeatherIconModule { }
