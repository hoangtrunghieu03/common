import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { FilterParam, FilterCondition } from 'src/app/shared/data/at.model';
import { MEDICALRECORD_FILTER, PATIENT } from 'src/app/shared/data/medicalrecord';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { clearStateCustomer, onLoadCustomersFilter, onLoadMedReByCustomerCode, onSendNotiPayment } from 'src/app/store/actions/customer.action';
import { onLoadServiceRequestFilter } from 'src/app/store/actions/serviceRequest.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Customer from '../../../../../at-common/model/Customer';
import CustomerCriterial from '../../../../../at-common/model/CustomerCriterial';
import CustomerReport from '../../../../../at-common/model/CustomerReport';
import { MEDICAL_SERVICE_STATUS, PAYMENT_STATUS, SERVICE_REQUEST } from '../../../../../at-common/model/enum';
import ServiceRequest from '../../../../../at-common/model/ServiceRequest';
import { formatPhoneNumber } from 'src/app/shared/functions/function-helper';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import MedicalRecordReport from '../../../../../at-common/model/MedicalRecordReport';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-medicalrecord',
  templateUrl: './medicalrecord.component.html',
  styleUrls: ['./medicalrecord.component.scss'],
  providers: [DestroySubsribeService]
})
export class MedicalrecordComponent implements OnInit {
  @ViewChild('tables', { static: false }) table: DatatableComponent;
  columnDef: Array<ColDef> = COL_DEF;
  medicalrecord: Customer[] | any= [];
  conditionData = MEDICALRECORD_FILTER;
  filterResult: FilterParam = {condition: 'patient', conditionSelect: this.conditionData.patient, value: null, fromDate: null, toDate: null}
  renderSelect: Array<any> = [];
  filters = new CustomerReport();
  filterReport = new CustomerCriterial();
  patientFilter = PATIENT;
  statusPaymentFilter = PAYMENT_STATUS;
  serviceRequest: ServiceRequest[] = [];
  statusMedical = MEDICAL_SERVICE_STATUS;
  textSearch: string = null;
  formatPhoneNumber = formatPhoneNumber;
  medicalRecordSelected: Array<any> = [];
  constructor(
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private datePipe: DatePipe,
    private modal: NgbModal
  ) {
  }
  onSelect({ selected }): void {
    this.medicalRecordSelected.splice(0, this.medicalRecordSelected.length);
    this.medicalRecordSelected.push(...selected);
  }

  onSendNotiPayment = ():void => {
    const modal:NgbModalRef = this.modal.open(ConfirmModalComponent,{
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = 'Xác nhận nhắc nhở thanh toán';
    modal.result.then(result => {
      if ( !result ) { return}
      this.store.dispatch(onSendNotiPayment({ reports: this.medicalRecordSelected }));

      this.medicalRecordSelected = [];
    }).catch(error => {
    })
  }

  onToggleExpandRow = (row) => {
    this.table.rowDetail.collapseAllRows();
    this.medicalrecord.forEach(row => { row.medicalRecordDetail = [] });

    this.store.dispatch(onLoadMedReByCustomerCode({ customerCode: row.customerCode }));
    this.store.select(state => state.customer.medicalCustomer)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((medicalRecordDetail: MedicalRecordReport) => {
        if (medicalRecordDetail && medicalRecordDetail.datas) {
          row.medicalRecordDetail = medicalRecordDetail.datas.map((item) => {
            return { ...item, ...{ _id: item.medicalRecordId } }
          })
        }
      })

    const timeout = setTimeout(() => {
      this.table.rowDetail.toggleExpandRow(row);
      clearTimeout(timeout);
    }, 200);
  }
  ngOnInit(): void {
    this.onLoadCustomers();
    this.onLoadServiceRequest();
  }
  onCollapseExpandRow = (row) => {
    this.table.rowDetail.toggleExpandRow(row);
  }
  onLoadCustomers = (): void => {
    this.filters.filter = this.filterReport;
    this.store.dispatch(onLoadCustomersFilter(this.filters));
    this.store.select(state => state.customer.customerFilter)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(customer => {
        if (!customer) return this.medicalrecord = [];
        this.medicalrecord = customer?.reports.map((item: any) => {
          return { ...item, ...{ _id: item.customerId } }
        })
      })
  }

  onLoadServiceRequest = (): void => {
    this.store.dispatch(onLoadServiceRequestFilter({ typeServiceRequest: SERVICE_REQUEST.TREATMENT_PROCESS }));
    this.store.select(state => state.serviceRequest.serviceRequestFilter)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(serviceRequest => serviceRequest && (this.serviceRequest = serviceRequest))
  }

  onSearch(event):void {
    this.textSearch = event;
    let filter = {...this.filterReport}
    filter.name = event;
    this.filterReport = filter;
    this.onLoadCustomers();
  }

  onFilterConditionChange = ():void => {
    Object.entries(MEDICALRECORD_FILTER).map(([key, value]) => {
      if (this.filterResult.condition === key) {
        this.filterResult.conditionSelect = value;
      }
    })
    this.filterResult.value = null;
    this.filterResult.fromDate = null;
    this.filterResult.toDate = null;
  }

  onAddCondiotion = (): void => {
    let newFilter: FilterCondition;
    if (((this.filterResult.condition == 'patient' || this.filterResult.condition == 'statusPayment' ||
      this.filterResult.condition == 'serviceRequest' ||
      this.filterResult.condition == 'statusMedical') && this.filterResult.value) ||
      (this.filterResult.fromDate && this.filterResult.toDate)) {

      if (this.filterResult.condition == 'patient' || this.filterResult.condition == 'statusPayment' ||
        this.filterResult.condition == 'serviceRequest' ||
        this.filterResult.condition == 'statusMedical') {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: this.filterResult.value,
          fromDate: null,
          toDate: null
        }
      } else {
        newFilter = {
          id: Date.now(),
          key: this.filterResult.condition,
          firstCondition: this.filterResult.conditionSelect,
          secondCondition: null,
          fromDate: this.filterResult.fromDate,
          toDate: this.filterResult.toDate,
        }
      }

      let isIncludes = this.renderSelect.findIndex(item => item.key === newFilter.key);
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }

      let filter = { ...this.filterReport }
      if (this.filterResult.conditionSelect == MEDICALRECORD_FILTER.examineDate) {
        filter.examinationDateFrom = this.filterResult.fromDate;
        filter.examinationDateTo = this.filterResult.toDate;
      } else if (this.filterResult.conditionSelect == MEDICALRECORD_FILTER.createDate) {
        filter.createDateFrom = this.filterResult.fromDate;
        filter.createDateTo = this.filterResult.toDate;
      } else if (this.filterResult.conditionSelect == MEDICALRECORD_FILTER.birthDate) {
        filter.birthDayFrom = this.filterResult.fromDate;
        filter.birthDayTo = this.filterResult.toDate;
      } else if (this.filterResult.conditionSelect == MEDICALRECORD_FILTER.patient) {
        filter.medical_service_type = this.filterResult.value;
      } else if (this.filterResult.conditionSelect == MEDICALRECORD_FILTER.statusMedical) {
        filter.statusMedical = this.filterResult.value;
      } else {
        filter.statusPayment = this.filterResult.value;
      }
      this.filterReport = filter;
      this.onLoadCustomers();
    }
  }

  onRemoveFilter = (param):void => {
    this.renderSelect = this.renderSelect.filter(x => x.id != param.id);
    let filter = {...this.filterReport}
    if (param.firstCondition == MEDICALRECORD_FILTER.birthDate) {
      filter.birthDayFrom = null;
      filter.birthDayTo = null;
    } else if (param.firstCondition == MEDICALRECORD_FILTER.examineDate) {
      filter.examinationDateFrom = null;
      filter.examinationDateTo = null;
    } else if (param.firstCondition == MEDICALRECORD_FILTER.createDate) {
      filter.createDateFrom = null;
      filter.createDateTo = null;
    } else if (param.firstCondition == MEDICALRECORD_FILTER.patient) {
      filter.medical_service_type = null;
    } else if (param.firstCondition == MEDICALRECORD_FILTER.statusMedical) {
      filter.statusMedical = null;
    } else {
      filter.statusPayment = null;
    }
    this.filterReport = filter;
    this.onLoadCustomers();
  }

  getServiceRequestName = (serviceRequestId: string): string => {
    return this.serviceRequest.find(serviceRequest => serviceRequest._id === serviceRequestId)?.serviceRequestName;
  }

  onGetLimitDate = () => {
    return this.datePipe.transform(new Date(this.filterResult.fromDate).setDate(new Date(this.filterResult.fromDate).getDate() + 30), 'yyyy-MM-dd')
  }

  ngOnDestroy(): void {
    this.store.dispatch(clearStateCustomer())
  }

}

const COL_DEF: Array<ColDef> = [
  {
    name: 'MBN',
    prop: 'customerCode',
    width: 5,
    router: true,
    path: 'I',
  },
  {
    name: 'Họ tên',
    prop: 'fullName',
    width: 50,
  },
  {
    name: 'Ghi chú',
    prop: 'note',
    width: 50,
  },
  {
    name: 'Số điện thoại',
    prop: 'tel',
    colType: 'tel',
    width: 10,
  },
  {
    name: 'Ngày sinh',
    prop: 'birthday',
    colType: 'date',
    width: 10,
  },
  {
    name: 'Còn nợ',
    prop: 'inDebt',
    colType: 'money',
    width: 80,
  }
];
