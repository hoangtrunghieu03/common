import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { ChartsModule } from 'ng2-charts';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { AtBaseTableModule } from "../../shared/components/at-base-table/at-base-table.module";
import { AtFeatherIconModule } from 'src/app/shared/components/feather-icons/feather-icons.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    ChartsModule,
    NgxDatatableModule,
    AtBaseTableModule,
    AtFeatherIconModule
  ]
})
export class DashboardModule { }
