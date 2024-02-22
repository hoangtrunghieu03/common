import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ChairSettingComponent } from './chair-setting.component';
import { ATModalModule } from '../../shared/modal/modal-common/modal.module';
import { AtSelectModule } from '../../shared/components/at-select/at-select.module';
import { ATDirectivesModule } from '../../shared/directives/directives.module';
import { AtFeatherIconModule } from '../../shared/components/feather-icons/feather-icons.module';
import { ChairSettingRoutingModule } from './chair-setting-routing.module';
import { ChairSettingDetailComponent } from './chair-setting-detail/chair-setting-detail.component';
import { AtCardModule } from 'src/app/shared/components/at-card/at-card.module';
import { AtExamineFooterModule } from 'src/app/shared/components/examine-view/examine-footer/examine-footer.module';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { AtInputModule } from 'src/app/shared/components/at-input/at-input.module';
import { ChairSettingModalComponent } from './chair-setting-modal/chair-setting-modal.component';
import { ChairListCusomerComponent } from './chair-list-cusomer/chair-list-cusomer.component';

@NgModule({
  declarations: [
    ChairSettingComponent,
    ChairSettingDetailComponent,
    ChairSettingModalComponent,
    ChairListCusomerComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ChairSettingRoutingModule,
    ReactiveFormsModule,
    ATModalModule,
    AtSelectModule,
    ATDirectivesModule,
    AtFeatherIconModule,
    AtCardModule,
    AtExamineFooterModule,
    AtInputModule
  ],
  exports: [ChairListCusomerComponent],
  providers: [DestroySubsribeService]
})
export class ChairSettingModule { }