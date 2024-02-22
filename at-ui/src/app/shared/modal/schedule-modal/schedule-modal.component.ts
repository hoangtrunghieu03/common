import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { loadCustomers, onLoadCustomerByCode, onLoadCustomersSearch } from 'src/app/store/actions/customer.action';
import Customer from '../../../../../../at-common/model/Customer';
import CustomerReport from '../../../../../../at-common/model/CustomerReport';
import { SCHEDULE_STATUS, SERVICE_REQUEST, TYPE_SCHEDULE } from '../../../../../../at-common/model/enum';
import MedicalRecord from '../../../../../../at-common/model/MedicalRecord';
import TreatmentProcess from '../../../../../../at-common/model/TreatmentProcess';
import { RootState } from '../../../store/entities/state.entity';
import { FormatDateComponent, regexEmail, regexFormEmail, scrollToFirstInvalidControl, validateAllFormFields, validateForm, regexFormTel, formatPhoneNumber } from '../../functions/function-helper';
import { DestroySubsribeService } from '../../service/destroySubscribe.service';
import MedicalBaseModel from '../../../../../../at-common/model/MedicalBaseModel';

@Component({
  selector: 'at-schedule-modal',
  templateUrl: './schedule-modal.component.html',
  styleUrls: ['./schedule-modal.component.scss'],
  providers: [DestroySubsribeService, DatePipe, FormatDateComponent]
})
export class ScheduleModalComponent implements OnInit {

  @Input() medicalRecordData: MedicalRecord;
  @Input() treatmentProcess: TreatmentProcess;
  @Input() medicalServiceIndicate: MedicalBaseModel;

  typeServiceRequest = SERVICE_REQUEST;
  scheduleType = TYPE_SCHEDULE;

  validateForm = validateForm;
  regexEmail = regexEmail;

  customerInfo: Customer = null;
  staffLoginId: string = null;

  telPattern: string = '^0.*';
  scheduleForm: FormGroup;
  customerForm: FormGroup;

  customerSelected = new Customer();

  customers: Customer[] = [];
  customerFilter: Array<any> = [];

  scheduleTypeList: {label: string, value: string | any}[] = [];

  minDate: { year: number; month: number; day: number; };
  maxDate: { year: number; month: number; day: number; };
  minScheduleDate: { year: number; month: number; day: number; };

  textSearch: string = null;

  formatPhoneNumber = formatPhoneNumber;

  constructor(
    public activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private datePipe: DatePipe,
    private formatDate: FormatDateComponent,
    private cdr: ChangeDetectorRef
  ) {
    this.scheduleForm = this.createscheduleForm();
    this.customerForm = this.createCustomerForm();
  }

  ngOnInit(): void {
    this.getLimitedDate();
    this.onLoadStaffLogin();
    this.onLoadCustomers();
    this.onLoadCustomerSearch(null);
    if (this.medicalRecordData && this.medicalRecordData.customerCode) {
      this.onLoadCustomerByCode(this.medicalRecordData?.customerCode);
    }

    this.scheduleTypeList = Object.values(TYPE_SCHEDULE).map((item) => ({ label: item, value: item }))
  }

  onLoadStaffLogin = (): void => {
    this.store.select(state => state.authencation._id)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(staffId => staffId && (this.staffLoginId = staffId))
  }
  onLoadCustomers = (): void => {
    this.store.dispatch(loadCustomers());
    this.store.select(state => state.customer.customerList)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(customer => {
        if (!customer) { return }
        this.customers = [...customer];
      })
  }

  onLoadCustomerByCode = (customerCode: string): void => {
    this.store.dispatch(onLoadCustomerByCode({ customerCode: customerCode }));
    this.store.select(state => state.customer.customerItem)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(customer => {
        if (!customer) return;
        this.customerInfo = customer;
        this.customerSelected = customer;
        this.customerForm = this.createCustomerForm();
        this.scheduleForm = this.createscheduleForm();
      })
  }

  createscheduleForm = (): FormGroup => {
    return this._formBuilder.group({
      medicalRecordCode: [this.medicalRecordData?.medicalRecordCode],
      customerCode: [this.medicalRecordData?.customerCode],
      serviceType: [this.medicalRecordData?.serviceType],
      scheduleTime: [this.treatmentProcess?.processDay, [Validators.required]],
      content: [this.treatmentProcess?.order, [Validators.required]],
      contentArea: [null],
      note: [this.treatmentProcess?.note],
      staff: [null],
      status: [SCHEDULE_STATUS.NOTYETARRIVED],
      customer: [null],
      typeSchedule: [null, [Validators.required]]
    })
  }

  createCustomerForm = (): FormGroup => {
    return this._formBuilder.group({
      fullName: [this.customerInfo?.fullName, [Validators.required]],
      sex: [!this.customerInfo ? 'Nam' : this.customerInfo.sex],
      tel: [formatPhoneNumber(this.customerInfo?.tel), [Validators.required, regexFormTel]],
      address: [this.customerInfo?.address, [Validators.required]],
      stt: [this.customerInfo?.stt],
      birthday: [this.datePipe.transform(this.customerInfo?.birthday, 'dd-MM-yyyy'), [Validators.required]],
      email: [this.customerInfo?.email, [regexFormEmail]],
      note: [this.customerInfo?.note],
      isPhoneContact: [false]
    })
  }

  onLoadCustomerSearch = (valueSearch: string): void => {
    let filters = {
      filter: { name: valueSearch }
    }
    this.store.dispatch(onLoadCustomersSearch(filters));
    this.store.select(state => state.customer.customerSearch)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((customer: CustomerReport) => {
        if (!customer || !customer.reports) { return this.customers = []; }
        this.customerFilter = customer.reports;
      })
  }

  onSearch(event): void {
    this.onLoadCustomerSearch(event);
  }

  getDateTime = (event) => {
    this.scheduleForm.get('scheduleTime').setValue(event);
  }

  onSaveForm = (): void => {
    if (this.scheduleForm.valid && this.customerForm.valid) {
      if (this.medicalRecordData) {
        this.scheduleForm.get('scheduleTime').setValue(this.formatDate.formatDate(this.scheduleForm.value.scheduleTime, 'yyyy-MM-dd'));
        this.scheduleForm.get('staff').setValue(this.staffLoginId);
        return this.activeModal.close(this.scheduleForm.value);
      }

      let arrayProps = ['fullName', 'address', 'note', 'sex', 'email', 'birthday'];
      if (arrayProps.some(val => this.validInclude(val))) return;

      if (!this.customers.some(val => val.tel === this.customerForm.value.tel?.replaceAll(' ', '') && !val.isPhoneContact)) {
        this.scheduleForm.get('customerCode').setValue(null);
      }
      this.customerForm.get('birthday').setValue(this.formatDate.formatDate(this.customerForm.value.birthday, 'yyyy-MM-dd'));
      this.customerForm.get('tel').setValue(this.customerForm.value.tel.replaceAll(' ', ''));
      this.scheduleForm.get('scheduleTime').setValue(this.formatDate.formatDate(this.scheduleForm.value.scheduleTime, 'yyyy-MM-dd'));
      this.scheduleForm.get('staff').setValue(this.staffLoginId);
      this.scheduleForm.get('customer').setValue(this.customerForm.value);
      this.activeModal.close(this.scheduleForm.value);
      return;
    }

    validateAllFormFields(this.customerForm);
    validateAllFormFields(this.scheduleForm);
    scrollToFirstInvalidControl(this.customerForm);
    scrollToFirstInvalidControl(this.scheduleForm);
  }

  onSelectCustomer = (event): void => {
    this.customerSelected = event ? this.customers.find(val => val._id === event.customerId) : new Customer();
    this.scheduleForm.get('customerCode').setValue(this.customerSelected.customerCode)
    this.customerForm.patchValue({
      fullName: this.customerSelected.fullName,
      address: this.customerSelected.address,
      tel: formatPhoneNumber(this.customerSelected.tel),
      note: this.customerSelected.note,
      sex: this.customerSelected.sex,
      stt: this.customerSelected.stt,
      email: this.customerSelected.email,
      birthday: this.datePipe.transform(this.customerSelected.birthday, 'dd-MM-yyyy'),
      isPhoneContact: this.customerSelected.isPhoneContact,
    });
    this.scheduleForm.get('customer').setValue(this.customerForm.value);
    this.textSearch = event ? this.customerSelected.customerCode + ' - ' + this.customerSelected.fullName + ' - ' + this.customerSelected.tel : '';
    this.cdr.detectChanges();
  }

  onChangeValueSelected = (event) => {
    if (event === this.scheduleType.ARCMAKING && this.medicalServiceIndicate) {
      this.scheduleForm.get('contentArea').setValue(this.medicalServiceIndicate.name);
      this.scheduleForm.get('content').setValue(null);
      return;
    }
    this.scheduleForm.get('content').setValue(null);
    this.scheduleForm.get('contentArea').setValue(null);
  }

  validInclude = (fieldName: string): boolean => {
    if (!this.medicalRecordData && this.customerSelected && ((this.customerSelected.tel && (this.customerForm.get('tel').value.replaceAll(' ', '') === this.customerSelected.tel)))) {
      if (fieldName !== 'birthday' && (fieldName === 'tel' ? this.customerForm.value[fieldName].replaceAll(' ', '') : this.customerForm.value[fieldName]) !== this.customerSelected[fieldName]) return true;
      if (fieldName === 'birthday' && this.datePipe.transform(this.customerSelected[fieldName], 'd/M/yyyy') !== this.formatDate.formatDate(this.customerForm.value[fieldName], 'd/M/yyyy')) return true;
    }
    return false;
  }

  ValidatorTel = (tel: any): Observable<boolean> => {
    let isValid: boolean = this.customers.filter(val => val._id != this.customerSelected._id).every(val => val.tel !== tel.replaceAll(' ', '') || (val.tel == this.customerSelected.tel && !val.isPhoneContact))
    return of(isValid)
  }

  validIncludeTel = (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(500).pipe(
      switchMap(() =>
        this.ValidatorTel(control.value)
          .pipe(
            map(isValid => {
              if (isValid) {
                return null
              }
            })
          ))
    )
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

}
