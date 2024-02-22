import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ServiceComponent } from "./service.component";
import { AtBaseTableModule } from "../../at-base-table/at-base-table.module";
import { AtCompleteModule } from "../../at-autocomplete/at-autocomplete.module";
import { AtFeatherIconModule } from "../../feather-icons/feather-icons.module";
import { AtInputDelaySearchModule } from "../../input-delay-search/input-delay-search.module";
import { AtDesignatModule } from "../designat/designat.module";
import { ATDirectivesModule } from "../../../directives/directives.module";
import { SettingsModule } from 'src/app/components/settings/settings.module';

@NgModule({
  declarations: [
    ServiceComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtBaseTableModule,
    AtCompleteModule,
    AtDesignatModule,
    AtInputDelaySearchModule,
    AtFeatherIconModule,
    ATDirectivesModule,
    SettingsModule
  ],
  exports: [ServiceComponent]
})
export class AtServiceModule { }
