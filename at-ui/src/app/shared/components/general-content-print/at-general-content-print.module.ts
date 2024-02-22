import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtFeatherIconModule } from '../feather-icons/feather-icons.module';
import { ATDirectivesModule } from '../../directives/directives.module';
import { HeaderContentPrintComponent } from './header-content-print/header-content-print.component';
import { DestroySubsribeService } from '../../service/destroySubscribe.service';
import { FooterContentPrintComponent } from './footer-content-print/footer-content-print.component';
import { AtTableSumaryModule } from '../at-table-sumary/at-table-sumary.module';
import { MedicalRecordPrintComponent } from './medical-record-print/medical-record-print.component';
import { ForwardingPrintComponent } from './forwarding-print/forwarding-print.component';
import { InventoryHistoryPrintComponent } from './inventory-history-print/inventory-history-print.component';
import { AtTableModule } from '../at-table/at-table.module';

@NgModule({
  declarations: [
    HeaderContentPrintComponent,
    FooterContentPrintComponent,
    MedicalRecordPrintComponent,
    ForwardingPrintComponent,
    ForwardingPrintComponent,
    InventoryHistoryPrintComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtFeatherIconModule,
    ATDirectivesModule,
    AtTableSumaryModule,
    AtTableModule
  ],
  providers: [
    DestroySubsribeService,
    DatePipe
  ],
  exports: [
    HeaderContentPrintComponent,
    FooterContentPrintComponent,
    MedicalRecordPrintComponent,
    ForwardingPrintComponent,
    InventoryHistoryPrintComponent
  ]
})
export class AtGeneralContentPrintModule { }