import { Component, Input, OnInit } from '@angular/core';
import Customer from '../../../../../../../at-common/model/Customer';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';

@Component({
  selector: 'at-customer-info',
  templateUrl: './at-customer-info.component.html',
  styleUrls: ['./at-customer-info.component.scss']
})
export class AtCustomerInfoComponent implements OnInit {

  @Input() customer: Customer;
  @Input() medicalRecord: MedicalRecord;

  constructor() { }

  ngOnInit(): void {
  }

}
