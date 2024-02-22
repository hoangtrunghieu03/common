import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PictureBlockComponent } from "./picture-block.component";
import { AtFeatherIconModule } from "../../feather-icons/feather-icons.module";

@NgModule({
  declarations: [
    PictureBlockComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtFeatherIconModule
  ],
  exports: [PictureBlockComponent]
})
export class AtPictureBlockModule { }
