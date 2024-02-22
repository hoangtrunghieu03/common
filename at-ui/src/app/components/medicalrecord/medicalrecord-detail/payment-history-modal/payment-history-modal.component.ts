import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { COLDEF_SERVICE } from 'src/app/shared/components/examine-view/fee/fee.component';
import { PrintService } from 'src/app/shared/service/print.service';
import MedicalBaseModel from '../../../../../../../at-common/model/MedicalBaseModel';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import PaymentHistory from '../../../../../../../at-common/model/PaymentHistory';
import { ATContent, DataCustomToPrint, PRINT_TYPE } from '../../../../shared/data/at.model';

@Component({
  selector: 'app-payment-history-modal',
  templateUrl: './payment-history-modal.component.html',
  styleUrls: ['./payment-history-modal.component.scss']
})
export class PaymentHistoryModalComponent implements OnInit {

  @Input() medicalRecord: MedicalRecord;
  @Input() paymentHistory: PaymentHistory;

  colDef = COLDEF_SERVICE;
  contentPayment: ATContent[] = [];

  medicalRecordFee: MedicalBaseModel[] = [];

  viewMedicalRecordFee: MedicalBaseModel[] = [];

  constructor(
    public modal: NgbActiveModal,
    private printService: PrintService) { }

  ngOnInit(): void {
    this.medicalRecordFee = this.paymentHistory.medicalServiceIndicates?.
      concat(this.paymentHistory?.medicalServices)

    this.contentPayment = [
      { label: 'Tổng', value: this.paymentHistory?.totalMoney },
      { label: 'Đã thanh toán', value: this.paymentHistory?.moneyPaymented },
      { label: 'Tiền giảm giá', value: this.paymentHistory?.discountAmount },
      { label: 'Còn lại', value: this.paymentHistory?.moneyPayment },
    ]
    this.onHandleData();
  }

  onHandleData() {
    this.medicalRecordFee.forEach((item) => {
      const result = this.viewMedicalRecordFee.some((item1,index) => {
        if (item1?.id === item.id) {  
          item1 = {
            ...item1,
            discountMoney : item1.discountMoney + item.discountMoney, 
            quantity: item1.quantity + item.quantity,
            totalMoney: item1.totalMoney + item.totalMoney,
          }
        this.viewMedicalRecordFee.splice(index ,1);
        this.viewMedicalRecordFee.push(item1);  
          return true;
        }
        return false; 
      })
      if (!result) {
        this.viewMedicalRecordFee.push(item);
      }
      this.medicalRecordFee = this.viewMedicalRecordFee;
    })
  }


  onPrint = () => {
    let dataCustom: DataCustomToPrint = new DataCustomToPrint();

    dataCustom.customerCode = this.paymentHistory.customerCode;
    dataCustom.medicalServiceIndicates = this.paymentHistory.medicalServiceIndicates;
    dataCustom.medicalServices = this.paymentHistory.medicalServices;

    dataCustom.totalMoney = this.paymentHistory?.totalMoney;
    dataCustom.moneyPaymented = (this.paymentHistory?.moneyPaymented - this.paymentHistory?.moneyCustomerProvide);
    dataCustom.totalAfterDiscount = (this.paymentHistory?.totalMoney - this.paymentHistory?.discountAmount);
    dataCustom.moneyPayment = this.paymentHistory?.moneyPayment;
    dataCustom.moneyIncome = this.paymentHistory?.moneyCustomerProvide;
    dataCustom.paymentDate = this.paymentHistory?.paymentDate;
    dataCustom.discountAmount = this.paymentHistory?.discountAmount;

    dataCustom.staffId = this.paymentHistory?.staffId;
    this.printService.onGetMedicalRecordDataPrint(JSON.stringify(dataCustom));
    this.printService.onPrint(this.medicalRecord._id, PRINT_TYPE.MEDICAL_RECORD);
    this.modal.close();
  }
}