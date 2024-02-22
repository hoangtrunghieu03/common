import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PicktureComponent } from "./pickture.component";
import { AtPictureBlockModule } from "../picture-block/picture-block.module";
import { AtExaminePictureModule } from '../examine-picture/examine-picture.module';
import { AtFeatherIconModule } from '../../feather-icons/feather-icons.module';

@NgModule({
  declarations: [
    PicktureComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtPictureBlockModule,
    AtExaminePictureModule,
    AtFeatherIconModule
  ],
  exports: [PicktureComponent]
})
export class AtPicktureModule { }
