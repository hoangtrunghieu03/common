import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { isArray } from 'rxjs/internal-compatibility';
import { pluck, takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { FormatDateComponent, scrollToFirstInvalidControl, validateAllFormFields } from 'src/app/shared/functions/function-helper';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadCustomerById, onLoadMedReByCustomerCode, onUpdateCustomer } from 'src/app/store/actions/customer.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Customer from '../../../../../../at-common/model/Customer';
import MedicalRecordReport from '../../../../../../at-common/model/MedicalRecordReport';
import { GeneralInfoComponent } from './general-info/general-info.component';
import * as _ from 'lodash';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MedicalrecordBookComponent } from './medicalrecord-book/medicalrecord-book.component';

@Component({
  selector: 'app-medicalrecord-detail',
  templateUrl: './medicalrecord-detail.component.html',
  styleUrls: ['./medicalrecord-detail.component.scss'],
  providers: [DestroySubsribeService, FormatDateComponent]
})
export class MedicalrecordDetailComponent implements OnInit {

  @ViewChild('customerCp',{static: false}) generalInfoCp: GeneralInfoComponent;
  tabIndex:number = 1;
  customerInfo: Customer = new Customer();
  customerMedReHistory: any[] = [];
  isEdit: boolean = false;
  columnDef = COL_DEF;

  constructor(
    private router: ActivatedRoute,
    private store: Store<RootState>,
    private _modal: NgbModal,
    private destroy: DestroySubsribeService,
    public location: Location,
    private formatDate: FormatDateComponent
  ) { }

  ngOnInit(): void {
    this.router.queryParams.pipe(pluck('_id'))
    .subscribe(param => param && this.onLoadCustomerInfo(param))
  }

  onLoadCustomerInfo = (id: string) => {
    this.store.dispatch(onLoadCustomerById({customerId: id}));
    this.store.select(state => state.customer.customerItem)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(customer => {
        if ( !customer ) { return }
        this.customerInfo = customer;
        this.onLoadAllMedicalRecordByCustomerCode(this.customerInfo?.customerCode)
      })
  }

  onLoadAllMedicalRecordByCustomerCode = (customerCode: string) => {
    this.store.dispatch(onLoadMedReByCustomerCode({ customerCode: customerCode }));
    this.store.select(state => state.customer.medicalCustomer)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((customerHistory: MedicalRecordReport) => {
        if (!customerHistory || !customerHistory.datas || customerHistory.datas?.length === 0) return this.customerMedReHistory = [];
        this.customerMedReHistory = customerHistory.datas.map((item) => {
          return { ...item, ...{ _id: item.medicalRecordId } }
        })
      })
  }

  onchangeTab = (event):void => {
    console.log(event);

  }
  handleMedicalRecordBook = (): void => {
    const modal: NgbModalRef = this._modal.open(MedicalrecordBookComponent, {
      centered: true,
      size: 'xl'
    })
    modal.componentInstance.medicalrecord = _.cloneDeep(this.customerMedReHistory);
    modal.componentInstance.title = 'Sổ bệnh án';
    modal.result.then(result => {
      if (!result) return;

    }).catch(error => {
    })
  }
  onUpdateCustomer = (): void => {
    if (this.generalInfoCp.customerForm.valid) {
      let customerForm = _.cloneDeep(this.generalInfoCp.customerForm.value);
      customerForm.birthday = this.formatDate.formatDate(this.generalInfoCp.customerForm.get('birthday').value, 'yyyy-MM-dd');
      customerForm.tel = customerForm.tel.replaceAll(' ', '');
      this.isEdit = !this.isEdit;
      return this.store.dispatch(onUpdateCustomer(customerForm));
    }
    validateAllFormFields(this.generalInfoCp.customerForm);
    scrollToFirstInvalidControl(this.generalInfoCp.customerForm);
  }

}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Mã bệnh án',
    prop: 'medicalRecordCode',
    width: 100,
    router: true,
    path: '/kham-benh/phong-tong-quat/chi-tiet/i',
  },
  {
    name: 'Tên bệnh án',
    prop: 'medicalRecordName',
    width: 100,
  },
  {
    name: 'Bác sĩ điều trị',
    prop: 'staffName',
    width: 100,
  },
  {
    name: 'Ngày khám',
    prop: 'date',
    width: 100,
    colType: 'date'
  },
  {
    name: 'Trạng thái',
    prop: 'statusMedical',
    width: 100,
  },
];
