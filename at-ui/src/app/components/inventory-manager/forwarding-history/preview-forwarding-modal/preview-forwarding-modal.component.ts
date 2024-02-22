import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DataForwardingCustomToPrint, PRINT_TYPE } from 'src/app/shared/data/at.model';
import { PrintService } from 'src/app/shared/service/print.service';
import DeliveryNote from '../../../../../../../at-common/model/DeliveryNote';
import { DELIVERYNOTE_TYPE } from '../../../../../../../at-common/model/enum';

@Component({
  selector: 'at-preview-forwarding-modal',
  templateUrl: './preview-forwarding-modal.component.html',
  styleUrls: ['./preview-forwarding-modal.component.scss']
})
export class PreviewForwardingModalComponent implements OnInit {

  @Input() img: string | undefined;
  @Input() forwardingData: DeliveryNote;

  constructor(
    public activeModal: NgbActiveModal,
    private printService: PrintService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
  }

  onPrint = () => {
    let dataCustom: DataForwardingCustomToPrint = new DataForwardingCustomToPrint();
    dataCustom.title = this.forwardingData?.typeDeliveryNote;
    dataCustom.content = { label: 'Nội dung', value: this.forwardingData?.content };
    if (this.forwardingData?.typeDeliveryNote == DELIVERYNOTE_TYPE.DELIVERY_LABO) {
      dataCustom.dateDelivery = { label: 'Ngày giao', value: this.datePipe.transform(this.forwardingData?.dateDelivery, 'dd/MM/yyyy') };
      dataCustom.receiver = { label: 'Họ tên người/ Đơn vị nhận mẫu', value: this.forwardingData?.receiver };
      dataCustom.sender = { label: 'Họ tên người giao', value: this.forwardingData?.sender };
    } else {
      dataCustom.dateDelivery = { label: 'Ngày nhận', value: this.datePipe.transform(this.forwardingData?.dateDelivery, 'dd/MM/yyyy') };
      dataCustom.receiver = { label: 'Họ tên người nhận', value: this.forwardingData?.receiver };
      dataCustom.sender = { label: 'Họ tên người/ Đơn vị giao', value: this.forwardingData?.sender };
    }

    this.printService.onGetForwardingDataPrint(JSON.stringify(dataCustom));
    this.printService.onPrint(null, PRINT_TYPE.FORWARDING);
    this.activeModal.close();
  }
}
