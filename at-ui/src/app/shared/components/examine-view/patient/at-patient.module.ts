import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PatientComponent } from "./patient.component";
import { AtToothDiagramModule } from "../at-tooth-diagram/at-tooth-diagram.module";

@NgModule({
  declarations: [
    PatientComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtToothDiagramModule
  ],
  exports: [PatientComponent]
})
export class AtPatientModule { }
