import { DatePipe, Location } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Route, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onConfirmSchedule, onLoadMedicalScheduleById, onUpdateMedicalScheduleStatus } from 'src/app/store/actions/medicalSchedule.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalSchedule from '../../../../../../at-common/model/MedicalSchedule';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormatDateComponent, formatPhoneNumber, regexEmail, regexFormTel, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { SCHEDULE_STATUS, TYPE_SCHEDULE } from '../../../../../../at-common/model/enum';
import { Subject } from 'rxjs';
import { loadCustomers, onLoadCustomersSearch } from 'src/app/store/actions/customer.action';
import CustomerReport from '../../../../../../at-common/model/CustomerReport';
import Customer from '../../../../../../at-common/model/Customer';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import * as _ from 'lodash';
@Component({
  selector: 'app-appointment-confirm-info',
  templateUrl: './appointment-confirm-info.component.html',
  styleUrls: ['./appointment-confirm-info.component.scss'],
  providers: [DestroySubsribeService, DatePipe, FormatDateComponent]
})
export class AppointmentConfirmInfoComponent implements OnInit {
  medicalSchedule: MedicalSchedule;
  scheduleForm: FormGroup;
  customerForm: FormGroup;
  limit: number = 10;
  columnDef: Array<ColDef> = COL_DEF;
  telPattern: string = '^0.*';
  minScheduleDate: { year: number; month: number; day: number; };
  minDate: { year: number; month: number; day: number; };
  maxDate: { year: number; month: number; day: number; };
  scheduleTypeList: {label: string, value: string | any}[] = [];
  listCustomerByTel: Array<any> = [];
  customers: Customer[] = [];
  customerSelected: Customer = null;
  formatPhoneNumber = formatPhoneNumber;
  validateForm = validateForm;
  regexEmail = regexEmail;
  constructor(public location: Location, private _modal : NgbModal, private formatDate: FormatDateComponent,  private routers: Router, private cdr: ChangeDetectorRef, private datePipe: DatePipe, private router: ActivatedRoute, private store: Store<RootState>, private destroyService: DestroySubsribeService,    private formBuilder: FormBuilder) {

   }

  ngOnInit(): void {

    this.getLimitedDate();
    this.customerForm = this.creatCustomerForm();
    this.scheduleForm = this.creatScheduleForm();
    this.router.queryParams.subscribe(param => {
      if ( param && param._id ) {
        this.onLoadMedicalSchedule(param._id);
        this.onLoadCustomers();
      }
    })
    this.scheduleTypeList = Object.values(TYPE_SCHEDULE).map((item) => ({ label: item, value: item }))
  }
  onLoadCustomers = ():void => {
    this.store.dispatch(loadCustomers());
    this.store.select( state => state.customer.customerList )
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe( customer => {
      if ( !customer ) { return this.customerForm.get('customerCode').setValue('1')}
      this.customers = [...customer];
    })
  }
  onInputChange(event: string) {
    let telInput = event.replace(/[^0-9]/g, '');
    if(telInput.length != 10) return;
    this.onLoadCustomerSearch(telInput);
    this.onResetSchedule();

  }
  onResetSchedule() {
    this.customerSelected = null;
    this.scheduleForm.get('customerCode').setValue(null);
    this.customerForm.patchValue({
      fullName: this.medicalSchedule?.customerSchedule?.fullName,
      address: null,
      tel: formatPhoneNumber(this.medicalSchedule?.customerSchedule?.tel),
      email: null,
      birthday: null,
      isPhoneContact: true
    });
  }
  onSelectRow(row, prop) {
    if (prop != 'customerCode' && prop != 'customerName') return;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        _id: prop == 'customerCode' ? row.customerId : row._id,
      }
    }

    this.routers.navigate([prop == 'customerCode' ? '/benh-an/I' : '/lich-hen/I'], navigationExtras);
  }
  onLoadCustomerSearch = (valueSearch: string): void => {
    let filters = {
      filter: { name: valueSearch }
    }
    this.store.dispatch(onLoadCustomersSearch(filters));
    this.store.select(state => state.customer.customerSearch)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((customer: CustomerReport) => {
        if (!customer || !customer.reports) { return this.listCustomerByTel = []; }
        this.listCustomerByTel = customer.reports;
        this.customerForm.get('isPhoneContact').setValue(this.listCustomerByTel.length > 0 ? true : false);
      })
  }
  getLimitedDate = () => {
    let day: number = new Date().getDate();
    let month: number = new Date().getMonth() + 1;
    let year: number = new Date().getFullYear();

    let today = new Date();
    today.setDate(today.getDate() + 1);

    this.minDate = { year: year - 100, month: month, day: day };
    this.maxDate = { year: year, month: month, day: day };
    this.minScheduleDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
  }
  handleConfirmSchudule() {
    if(this.customerForm.valid && this.scheduleForm.valid) {
      const modal: NgbModalRef = this._modal.open(ConfirmModalComponent, {
        centered: true,
        size: 'md',
      })
      modal.componentInstance.title = 'Xác nhận lịch hẹn';
      modal.componentInstance.content = `Xác nhận lịch hẹn bệnh nhân <b>${this.customerForm.value.fullName}</b>`;
      modal.result.then(result => {
        if (!result) { return }
        this.customerForm.get('tel').setValue(this.customerForm.value.tel.replaceAll(' ', ''));
        if(!this.customerForm.value?.birthday)   this.customerForm.get('birthday').setValue(this.datePipe.transform(new Date(), 'dd-MM-yyyy'));
        this.customerForm.get('birthday').setValue(this.formatDate.formatDate(this.customerForm.value.birthday, 'yyyy-MM-dd'));
        this.scheduleForm.get('customer').setValue(this.customerForm.value);
        this.scheduleForm.get('scheduleTime').setValue(this.formatDate.formatDate(this.scheduleForm.value.scheduleTime, 'yyyy-MM-dd'));
        this.store.dispatch(onConfirmSchedule(this.scheduleForm.value));
      }).catch(error => {
      })

      return;
    }
    validateAllFormFields(this.customerForm);
    scrollToFirstInvalidControl(this.customerForm);
    validateAllFormFields(this.scheduleForm);
    scrollToFirstInvalidControl(this.scheduleForm);
    this.cdr.detectChanges();
  }
  onLoadMedicalSchedule = (_id) => {
    this.store.dispatch(onLoadMedicalScheduleById({_id: _id}));
    this.store.select(state => state.medicalSchedule.medicalSchedule)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalSchedule => {
        if (!medicalSchedule) return;
        this.medicalSchedule = medicalSchedule;
        this.customerForm = this.creatCustomerForm();
        this.scheduleForm = this.creatScheduleForm();
        this.onLoadCustomerSearch(this.medicalSchedule?.customerSchedule?.tel);
        // this.getLimitedDate();
      })
  }
  onSelectCustomer(customerId: String): void {
    this.customerSelected = customerId ? this.customers.find( val => val._id === customerId) : new Customer();
    this.scheduleForm.get('customerCode').setValue(this.customerSelected.customerCode);
    this.customerForm.patchValue({
      fullName: this.customerSelected.fullName,
      address: this.customerSelected.address,
      tel: formatPhoneNumber(this.customerSelected.tel),
      birthday: this.datePipe.transform(this.customerSelected.birthday, 'dd-MM-yyyy'),
      email: this.customerSelected.email,
      isPhoneContact: this.customerSelected?.isPhoneContact
    });
    this.scheduleForm.get('customer').setValue(this.customerForm.value);
    this.cdr.detectChanges();

  }
  creatScheduleForm() {
    return this.formBuilder.group({
      _id: [this.medicalSchedule?._id],
      customerCode: [null],
      customer: [null],
      content: [this.medicalSchedule?.content, [Validators.required]],
      scheduleTime: [this.datePipe.transform(this.medicalSchedule?.scheduleTime, 'dd-MM-yyyy'), [Validators.required]],
      typeSchedule: [TYPE_SCHEDULE.ORTHER]
    })
  }
  handleCancelSchedule() {
    const modal: NgbModalRef = this._modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md',
    })
    modal.componentInstance.title = 'Hủy lịch hẹn';
    modal.componentInstance.content = `Hủy lịch hẹn bệnh nhân <b>${this.customerForm.value.fullName}</b>`;
    modal.result.then(result => {
      if (!result) { return }
      let medicalScheduleData = _.cloneDeep(this.medicalSchedule);
      medicalScheduleData.status = SCHEDULE_STATUS.CANCEL;
      this.store.dispatch(onUpdateMedicalScheduleStatus(medicalScheduleData));
      this.routers.navigate(['lich-hen']);
    }).catch(error => {
    })
  }
  creatCustomerForm() {
    // const telControl = this.formBuilder.control(
    //   { value: formatPhoneNumber(this.medicalSchedule?.customerSchedule?.tel), disabled: true },
    //   [Validators.required, regexFormTel]
    // );
    return this.formBuilder.group({
      fullName: [this.medicalSchedule?.customerSchedule?.fullName, [Validators.required]],
      sex: ["Nam"],
      tel:  [formatPhoneNumber(this.medicalSchedule?.customerSchedule?.tel), [Validators.required, regexFormTel]],
      email: [null],
      address: [null],
      birthday: [null],
      isPhoneContact: [true],
    })
  }

}
const COL_DEF: Array<ColDef> = [
  {
    name: 'MBN',
    prop: 'customerCode',
    width: 5,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: true,
    path: '',
  },
  {
    name: 'Tên bệnh nhân',
    prop: 'fullName',
    width: 10,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: 'Ngày sinh',
    prop: 'birthday',
    width: 10,
    colType: 'date',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  },
  {
    name: '',
    prop: 'action',
    width: 80,
    colType: '',
    styleHeader: '',
    styleBody: '',
    router: false,
    path: '',
  }
];
