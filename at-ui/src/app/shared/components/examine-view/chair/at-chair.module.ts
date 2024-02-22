import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ATModalModule } from 'src/app/shared/modal/modal-common/modal.module';
import { ChairComponent } from "./chair.component";
import { AtSelectModule } from '../../at-select/at-select.module';
import { ATDirectivesModule } from 'src/app/shared/directives/directives.module';
import { ChairContentComponent } from './chair-content/chair-content.component';
import { AtFeatherIconModule } from '../../feather-icons/feather-icons.module';
import { ChairModalComponent } from './chair-modal/chair-modal.component';

@NgModule({
  declarations: [
    ChairComponent,
    ChairContentComponent,
    ChairModalComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    ATModalModule,
    AtSelectModule,
    ATDirectivesModule,
    AtFeatherIconModule
  ],
  exports: [ChairComponent, ChairContentComponent]
})
export class AtChairModule { }