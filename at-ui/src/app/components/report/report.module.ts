import { InventoryComponent } from './inventory/inventory.component';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReportRoutingModule } from "./report-routing.module";
import { InventoryTotalComponent } from "./inventory/inventory-total/inventory-total.component";
import { RevenueComponent } from "./revenue/revenue.component";
import { OverviewComponent } from "./revenue/overview/overview.component";
import { StaffReportComponent } from "./staff-report/staff-report.component";
import { ServiceComponent } from "./revenue/service/service.component";
import { SharedModule } from "../../shared/shared.module";
import { ChartsModule } from 'ng2-charts';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { StaffDetailComponent } from "./staff-report/staff-detail/staff-detail.component";
import { AtCardModule } from "../../shared/components/at-card/at-card.module";
import { AtFilterViewModule } from "../../shared/components/at-filter-view/at-filter-view.module";
import { AtTableModule } from "../../shared/components/at-table/at-table.module";
import { AtTableSumaryModule } from "../../shared/components/at-table-sumary/at-table-sumary.module";
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { AtExamineFooterModule } from "../../shared/components/examine-view/examine-footer/examine-footer.module";
import { ATDirectivesModule } from '../../shared/directives/directives.module';
import { RoomComponent } from './revenue/room/room.component';
import { OverviewDetailComponent } from './revenue/overview/overview-detail/overview-detail.component';
import { AtInputDelaySearchModule } from "../../shared/components/input-delay-search/input-delay-search.module";
import { InventoryByRoomComponent } from './inventory/inventory-by-room/inventory-by-room.component';
import { InventoryByRoomDetailComponent } from './inventory/inventory-by-room-detail/inventory-by-room-detail.component';

@NgModule({
  declarations: [
    RevenueComponent,
    InventoryTotalComponent,
    OverviewComponent,
    StaffReportComponent,
    ServiceComponent,
    StaffDetailComponent,
    RoomComponent,
    OverviewDetailComponent,
    InventoryComponent,
    InventoryByRoomComponent,
    InventoryByRoomDetailComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    SharedModule,
    ChartsModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    AtCardModule,
    AtFilterViewModule,
    AtTableModule,
    AtTableSumaryModule,
    AtExamineFooterModule,
    ATDirectivesModule,
    AtInputDelaySearchModule
  ],
  providers: [DatePipe, DestroySubsribeService]
})
export class ReportModule { }
