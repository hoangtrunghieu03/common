import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtToothDiagramComponent } from "./at-tooth-diagram.component";

@NgModule({
  declarations: [
    AtToothDiagramComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [AtToothDiagramComponent]
})
export class AtToothDiagramModule { }
