import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtSelectComponent } from "./at-select.component";
import { AtFeatherIconModule } from '../feather-icons/feather-icons.module';
import { ATDirectivesModule } from '../../directives/directives.module';
import { AtInputDelaySearchModule } from '../input-delay-search/input-delay-search.module';

@NgModule({
  declarations: [
    AtSelectComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtFeatherIconModule,
    ATDirectivesModule,
  ],
  exports: [AtSelectComponent]
})
export class AtSelectModule { }
