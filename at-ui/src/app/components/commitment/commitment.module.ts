import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtSignaturePadModule } from '../../shared/components/at-signature-pad/at-signature-pad.module';
import { CommitmentRoutingModule } from './commitment-routing.module';
import { CommitmentComponent } from './commitment.component';
import { BracesCommitmentComponent } from './braces-commitment/braces-commitment.component';
import { MinorsurgeryCommitmentComponent } from './minorsurgery-commitment/minorsurgery-commitment.component';
import { ATDirectivesModule } from 'src/app/shared/directives/directives.module';
import { ReceiptComponent } from './receipt/receipt.component';
import { DeliveryNoteComponent } from './delivery-note/delivery-note.component';
import { AtPictureBlockModule } from 'src/app/shared/components/examine-view/picture-block/picture-block.module';
import { ATModalModule } from 'src/app/shared/modal/modal-common/modal.module';

@NgModule({
  declarations: [
    CommitmentComponent,
    BracesCommitmentComponent,
    MinorsurgeryCommitmentComponent,
    ReceiptComponent,
    DeliveryNoteComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CommitmentRoutingModule,
    AtSignaturePadModule,
    ATDirectivesModule,
    AtPictureBlockModule,
    ATModalModule
  ],
  entryComponents: [
  ],
  providers: [DatePipe]
})
export class CommitmentModule { }
