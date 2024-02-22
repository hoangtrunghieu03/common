import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtFilterViewComponent } from "./at-filter-view.component";
import { ATDirectivesModule } from '../../directives/directives.module';

@NgModule({
  declarations: [
    AtFilterViewComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ATDirectivesModule
  ],
  exports: [AtFilterViewComponent]
})
export class AtFilterViewModule { }
