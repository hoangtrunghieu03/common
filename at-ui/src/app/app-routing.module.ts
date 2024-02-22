import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { content } from './shared/routes/content-routes';
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import { LoginComponent } from './components/auth/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { CommitmentComponent } from './components/commitment/commitment.component';
import { BracesCommitmentComponent } from './components/commitment/braces-commitment/braces-commitment.component';
import { MinorsurgeryCommitmentComponent } from './components/commitment/minorsurgery-commitment/minorsurgery-commitment.component';
import { ReceiptComponent } from './components/commitment/receipt/receipt.component';
import { DeliveryNoteComponent } from './components/commitment/delivery-note/delivery-note.component';
import { MedicalRecordPrintComponent } from './shared/components/general-content-print/medical-record-print/medical-record-print.component';
import { PRINT_TYPE } from './shared/data/at.model';
import { ForwardingPrintComponent } from './shared/components/general-content-print/forwarding-print/forwarding-print.component';
import { InventoryHistoryPrintComponent } from './shared/components/general-content-print/inventory-history-print/inventory-history-print.component';
import { AuthZaloComponent } from './components/settings/auth-zalo/auth-zalo.component';
import { AppointmentScheduleQRComponent } from './components/appointment-schedule/appointment-schedule-qr/appointment-schedule-qr.component';

const routes: Routes = [
  {
    path: 'dang-nhap',
    component: LoginComponent,
  },
  {
    path: 'zalo/auth',
    component: AuthZaloComponent,
  },
  {
    path: `customerQR/:_id`,
    component: AppointmentScheduleQRComponent,
  },
  {
    path: '',
    redirectTo: 'dang-nhap',
    pathMatch: 'full'
  },
  {
    path: 'ban-cam-ket',
    component: CommitmentComponent,
    children: [
      {
        path: 'cam-ket-nieng-rang',
        component: BracesCommitmentComponent,
      },
      {
        path: 'cam-ket-phau-thuat',
        component: MinorsurgeryCommitmentComponent,
      },
      {
        path: 'phieu-nhan-khi-cu',
        component: ReceiptComponent,
      },
      {
        path: 'phieu-giao-mau-ham',
        component: DeliveryNoteComponent,
      },
    ]
  },
  {
    path: '',
    component: ContentLayoutComponent,
    children: content
  },
  { path: '**', component: PageNotFoundComponent },
  {
      path: PRINT_TYPE.MEDICAL_RECORD,
      component: MedicalRecordPrintComponent,
      outlet: 'print',
  },
  {
      path: PRINT_TYPE.FORWARDING,
      component: ForwardingPrintComponent,
      outlet: 'print',
  },
  {
      path: PRINT_TYPE.INVENTORY_HISTORY,
      component: InventoryHistoryPrintComponent,
      outlet: 'print',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
