import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtInputModule } from 'src/app/shared/components/at-input/at-input.module';
import { ATDirectivesModule } from "../../../directives/directives.module";
import { AtFeatherIconModule } from "../../feather-icons/feather-icons.module";
import { ServiceRequestComponent } from './service-request.component';

@NgModule({
  declarations: [
    ServiceRequestComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtFeatherIconModule,
    ATDirectivesModule,
    AtInputModule
  ],
  exports: [ServiceRequestComponent]
})
export class AtServiceRequestModule { }
