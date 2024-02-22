import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PictureAdditionComponent } from './picture-addition/picture-addition.component';
import { AtInputDelaySearchModule } from '../../input-delay-search/input-delay-search.module';
import { AtTableModule } from '../../at-table/at-table.module';
import { AtFilterViewModule } from '../../at-filter-view/at-filter-view.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ATDirectivesModule } from '../../../directives/directives.module';
import { RouterModule } from '@angular/router';
import { AtFeatherIconModule } from '../../feather-icons/feather-icons.module';
import { PictureAdditonModalComponent } from './picture-addition-modal/picture-addition-modal.component';
import { AtPictureBlockModule } from '../picture-block/picture-block.module';
import { ATModalModule } from 'src/app/shared/modal/modal-common/modal.module';

@NgModule({
  declarations: [
    PictureAdditionComponent,
    PictureAdditonModalComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AtFeatherIconModule,
    AtPictureBlockModule,
    ATModalModule
  ],
  exports: [PictureAdditionComponent, PictureAdditonModalComponent]
})
export class AtExaminePictureModule { }
