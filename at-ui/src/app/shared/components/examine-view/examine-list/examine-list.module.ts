import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExamineListComponent } from './examine-list.component';
import { AtInputDelaySearchModule } from '../../input-delay-search/input-delay-search.module';
import { AtTableModule } from '../../at-table/at-table.module';
import { AtFilterViewModule } from '../../at-filter-view/at-filter-view.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ATDirectivesModule } from '../../../directives/directives.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    ExamineListComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtInputDelaySearchModule,
    AtTableModule,
    AtFilterViewModule,
    NgxDatatableModule,
    ATDirectivesModule,
    RouterModule
  ],
  exports: [ExamineListComponent]
})
export class AtExamineListModule { }
