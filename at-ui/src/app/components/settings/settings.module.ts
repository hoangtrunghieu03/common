import { AuthZaloComponent } from './auth-zalo/auth-zalo.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from "./settings-routing.module";
import { SettingComboComponent } from "./setting-combo/setting-combo.component";
import { SettingComboDetailComponent } from './setting-combo/setting-combo-detail/setting-combo-detail.component';
import { SettingRoleComponent } from "./setting-role/setting-role.component";
import { SettingServiceComponent } from "./setting-service/setting-service.component";
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ServiceDetailComponent } from './setting-service/service-detail/service-detail.component';
import { ServiceAddDialogComponent } from './setting-service/service-add-dialog/service-add-dialog.component';
import { SettingRoleDetailComponent } from './setting-role/setting-role-detail/setting-role-detail.component';
import { ComboAddDialogComponent } from './setting-combo/combo-add-dialog/combo-add-dialog.component';
import { AtCompleteModule } from "../../shared/components/at-autocomplete/at-autocomplete.module";
import { AtBaseTableModule } from "../../shared/components/at-base-table/at-base-table.module";
import { AtInputModule } from "../../shared/components/at-input/at-input.module";
import { AtDataAccessModule } from "../../shared/components/at-data-access/at-data-access.module";
import { AtExamineFooterModule } from "../../shared/components/examine-view/examine-footer/examine-footer.module";
import { AtInputDelaySearchModule } from "../../shared/components/input-delay-search/input-delay-search.module";
import { AtTableModule } from "../../shared/components/at-table/at-table.module";
import { AtFeatherIconModule } from "../../shared/components/feather-icons/feather-icons.module";
import { ATDirectivesModule } from '../../shared/directives/directives.module';
import { AtSelectModule } from 'src/app/shared/components/at-select/at-select.module';
import { SettingAllocateComponent } from "./setting-allocate/setting-allocate.component";
import { AllocateAddDialogComponent } from "./setting-allocate/allocate-add-dialog/allocate-add-dialog.component"
import { AllocateDetailComponent } from './setting-allocate/allocate-detail/allocate-detail.component'
import { AtFilterViewModule } from '../../shared/components/at-filter-view/at-filter-view.module';
import { SettingPrintComponent } from './setting-print/setting-print.component';
import { AtPictureBlockModule } from '../../shared/components/examine-view/picture-block/picture-block.module';
import { SettingZaloComponent } from './setting-zalo/setting-zalo.component';

@NgModule({
  declarations: [
      SettingServiceComponent,
      SettingRoleComponent,
      SettingComboComponent,
      SettingComboDetailComponent,
      ServiceDetailComponent,
      ServiceAddDialogComponent,
      SettingRoleDetailComponent,
      ComboAddDialogComponent,
      SettingAllocateComponent,
      AllocateAddDialogComponent,
      AllocateDetailComponent,
      SettingPrintComponent,
      SettingZaloComponent,
      AuthZaloComponent
    ],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtBaseTableModule,
    AtCompleteModule,
    AtInputModule,
    AtExamineFooterModule,
    AtDataAccessModule,
    AtInputDelaySearchModule,
    AtTableModule,
    AtFeatherIconModule,
    ATDirectivesModule,
    AtSelectModule,
    AtFilterViewModule,
    AtPictureBlockModule
  ],
  exports: [
    ServiceAddDialogComponent
  ]
})
export class SettingsModule { }
