import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtTableComponent } from "./at-table.component";
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import {RouterModule} from '@angular/router';
import { ATDirectivesModule } from '../../directives/directives.module';


@NgModule({
  declarations: [
    AtTableComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    RouterModule,
    ATDirectivesModule
  ],
  exports: [AtTableComponent]
})
export class AtTableModule { }
