import { MedicalAdjusHistory } from './inventory-supply/medical-supply-adjus-history/medical-supply-adjus-history.component';
import { InventorySupplyGiveBackComponent } from './inventory-supply/inventory-supply-give-back/inventory-supply-give-back.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { InventoryManagerComponent } from './inventory-manager.component';
import { InventoryManagerRoutingModule } from './inventory-manager.routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InventoryAddDialogComponent } from './inventory-supply/inventory-add-dialog/inventory-add-dialog.component';
import { InventoryDetailComponent } from "./inventory-supply/inventory-detail/inventory-detail.component";
import { InventorySupplyRequestComponent } from "./inventory-supply/inventory-supply-request/inventory-supply-request.component";
import { InventorySupplyComponent } from './inventory-supply/inventory-supply.component'
import { InventoryEquipmentComponent } from "./inventory-equipment/inventory-equipment.component";
import { EquipmentAddDialogComponent } from "./inventory-equipment/equipment-add-dialog/equipment-add-dialog.component";
import { EquipmentDetailComponent } from "./inventory-equipment/equipment-detail/equipment-detail.component";
import { AtFeatherIconModule } from "../../shared/components/feather-icons/feather-icons.module";
import { AtTableModule } from "../../shared/components/at-table/at-table.module";
import { AtDatePickerModule } from "../../shared/components/at-datepicker/at-datepicker.module";
import { AtSelectModule } from "../../shared/components/at-select/at-select.module";
import { AtInputDelaySearchModule } from "../../shared/components/input-delay-search/input-delay-search.module";
import { AtInputModule } from "../../shared/components/at-input/at-input.module";
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { AtBaseTableModule } from "../../shared/components/at-base-table/at-base-table.module"
import { ExportHistoryComponent } from "../../components/inventory-manager/export-history/export-history.component"
import { ForwardingHistoryComponent } from "../../components/inventory-manager/forwarding-history/forwarding-historycomponent"
import { PreviewForwardingModalComponent } from "../../components/inventory-manager/forwarding-history/preview-forwarding-modal/preview-forwarding-modal.component"
import { AdjustmentHistoryComponent } from "./adjustment-history/adjustment-history.component"
import { ImportHistoryComponent } from "../../components/inventory-manager/import-history/import-history.component"
import { AttritionHistoryComponent } from "../../components/inventory-manager/attrition-history/attrition-history.component"
import { InventorySupplyAdjustmentComponent } from './inventory-supply/inventory-supply-adjustment/inventory-supply-adjustment.component';
import { AtExamineFooterModule } from "../../shared/components/examine-view/examine-footer/examine-footer.module";
import { InventorySupplyExportComponent } from './inventory-supply/inventory-supply-export/inventory-supply-export.component';
import { ATModalModule } from 'src/app/shared/modal/modal-common/modal.module';
import { AtCompleteModule } from 'src/app/shared/components/at-autocomplete/at-autocomplete.module';
import { ATDirectivesModule } from 'src/app/shared/directives/directives.module';
import { InventoryWarehouseComponent } from './inventory-supply/inventory-warehouse/inventory-warehouse.component';
import { AtFilterViewModule } from '../../shared/components/at-filter-view/at-filter-view.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MedicalSupplyListComponent } from './inventory-supply/medical-supply-list/medical-supply-list.component';
@NgModule({
  declarations: [
    InventoryManagerComponent,
    InventoryAddDialogComponent,
    InventoryDetailComponent,
    InventorySupplyComponent,
    InventoryEquipmentComponent,
    EquipmentAddDialogComponent,
    EquipmentDetailComponent,
    ExportHistoryComponent,
    AdjustmentHistoryComponent,
    ImportHistoryComponent,
    InventorySupplyAdjustmentComponent,
    InventorySupplyExportComponent,
    InventoryWarehouseComponent,
    AttritionHistoryComponent,
    ForwardingHistoryComponent,
    PreviewForwardingModalComponent,
    InventorySupplyRequestComponent,
    MedicalSupplyListComponent,
    InventorySupplyGiveBackComponent,
    MedicalAdjusHistory
  ],
  imports: [
    CommonModule,
    InventoryManagerRoutingModule,
    SharedModule,
    NgbModule,
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,
    AtFeatherIconModule,
    AtTableModule,
    AtDatePickerModule,
    AtSelectModule,
    AtInputDelaySearchModule,
    AtInputModule,
    AtBaseTableModule,
    AtExamineFooterModule,
    ATModalModule,
    AtCompleteModule,
    ATDirectivesModule,
    AtFilterViewModule
  ],
  providers: [DatePipe, DestroySubsribeService]
})
export class InventoryManagerModule {}
