import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { PreviewImgModalComponent } from 'src/app/shared/modal/preview-img-modal/preview-img-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadDeliveryNote } from 'src/app/store/actions/DeliveryNote.action';
import { RootState } from 'src/app/store/entities/state.entity';
import DeliveryNote from '../../../../../../at-common/model/DeliveryNote';
import { PreviewForwardingModalComponent } from './preview-forwarding-modal/preview-forwarding-modal.component';

@Component({
  selector: 'app-forwarding-history',
  templateUrl: './forwarding-history.component.html',
  styleUrls: ['./forwarding-history.component.scss']
})
export class ForwardingHistoryComponent implements OnInit {

  colDef: Array<ColDef> = COL_DEF;
  forwardingHistory: Array<DeliveryNote> = [];

  constructor(
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.onLoadForwardingHistory();
  }

  onLoadForwardingHistory = () => {
    this.store.dispatch(onLoadDeliveryNote());
    this.store.select(state => state.deliveryNote.deliveryNoteList)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(deliveryNoteList => {
        if (!deliveryNoteList) return;
        this.forwardingHistory = deliveryNoteList;
      })
  }

  viewDetail = (img: string, forwarding: DeliveryNote): void => {
    const modal = this.modal.open(PreviewForwardingModalComponent, {
      centered: true,
      windowClass: 'product-preview-img'
    });
    modal.componentInstance.img = img;
    modal.componentInstance.forwardingData = forwarding;
  }
}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Ngày tạo',
    prop: 'createDateTime',
    width: 100,
    colType: 'date'
  },
  {
    name: 'Loại phiếu',
    prop: 'typeDeliveryNote',
    width: 80,
  },
  {
    name: 'Người giao',
    prop: 'sender',
    width: 80,
  },
  {
    name: 'Người nhận',
    prop: 'receiver',
    width: 80,
  },
  {
    name: 'Nội dung',
    prop: 'content',
    width: 80,
  },
  {
    name: 'Phiếu',
    prop: 'action',
    width: 50,
  }
];