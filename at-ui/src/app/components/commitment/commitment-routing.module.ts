import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BracesCommitmentComponent } from './braces-commitment/braces-commitment.component';
import { CommitmentComponent } from './commitment.component';
import { ReceiptComponent } from './receipt/receipt.component';
import { MinorsurgeryCommitmentComponent } from './minorsurgery-commitment/minorsurgery-commitment.component';
import { DeliveryNoteComponent } from './delivery-note/delivery-note.component';


const routes: Routes = [
  {
    path: '',
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CommitmentRoutingModule { }