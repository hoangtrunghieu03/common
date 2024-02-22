import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { GeneralDetailComponent } from 'src/app/components/examine/general/general-detail/general-detail.component';
import MedicalBaseModel from '../../../../../../../at-common/model/MedicalBaseModel';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import Payment from '../../../../../../../at-common/model/Payment';
import ColumnDef from '../../at-base-table/at-base-table.component';

@Component({
  selector: 'at-fee',
  templateUrl: './fee.component.html',
  styleUrls: ['./fee.component.scss'],
})
export class  FeeComponent implements OnInit {

  @Input() medicalRecordFee: MedicalBaseModel[] = [];
  @Input() medicalRecord: MedicalRecord;
  @Input() mergeData : boolean = true;
  feeColDef: Array<ColumnDef> = COLDEF_SERVICE;
  contentFee: Array<any> = [];
  viewMedicalRecordFee: MedicalBaseModel[] = [];

  constructor() {}

  ngOnInit(): void {
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


  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.medicalRecordFee = this.medicalRecord.medicalServiceIndicates?.
      concat(this.medicalRecord?.medicalServices);
    this.viewMedicalRecordFee = [];
    if(this.mergeData){
      this.onHandleData();
    }
    
    this.contentFee = [
      { label: 'Tổng', price: this.medicalRecord?.payment?.totalMoney },
      { label: 'Đã thanh toán', price: this.medicalRecord?.payment?.moneyPaymented },
      { label: 'Tiền giảm giá', price: this.medicalRecord?.payment?.discountAmount },
      { label: 'Còn lại', price: this.medicalRecord?.payment?.moneyPayment },
    ];
  }
}

export const COLDEF_SERVICE: Array<ColumnDef> = [
  {
    label: 'Tên chỉ định',
    title: 'name',
    style: 'text-align: center',
    headerStyle: 'text-align: center',
  },
  {
    label: 'Số lượng',
    title: 'quantity',
    style: 'text-align: center',
    headerStyle: 'text-align: center',
  },
  {
    label: 'Giá dịch vụ',
    title: 'money',
    colType: 'money',
    style: 'text-align: center',
    headerStyle: 'text-align: center',
  },
  {
    label: 'Giảm giá',
    title: 'discountMoney',
    colType: 'money',
    style: 'text-align: center',
    headerStyle: 'text-align: center',
    canUpdate: false,
    fieldUpdate: null,
    updateType: null,
  },
  {
    label: 'Tổng',
    title: 'totalMoney',
    colType: 'money',
    style: 'text-align: center',
    headerStyle: 'text-align: center',
  },
];
