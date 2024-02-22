import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { formatCurentcy, formatPhoneNumber, regexEmail, regexFormEmail, regexFormTel, validateForm } from 'src/app/shared/functions/function-helper';
import Customer from '../../../../../../../at-common/model/Customer';
import { RootState } from '../../../../store/entities/state.entity';
import { DestroySubsribeService } from '../../../../shared/service/destroySubscribe.service';
import Role from '../../../../../../../at-common/model/Role';
import { Observable, of, timer } from 'rxjs';
import { loadCustomers } from 'src/app/store/actions/customer.action';
import { SEX_OPTION } from 'src/app/shared/data/setting';

@Component({
  selector: 'at-general-info',
  templateUrl: './general-info.component.html',
  styleUrls: ['./general-info.component.scss']
})
export class GeneralInfoComponent implements OnInit {

  @Input() customer: Customer = new Customer();
  @Output() eventChangeAction: EventEmitter<any> = new EventEmitter();
  customerInfo: {label: string, value: string | any, isUpdate: boolean, formName: string, disabled?: boolean, require?: boolean}[] = [];
  medicalInfo: {label: string, value: string | any}[] = [];
  customerForm: FormGroup;

  customers: Customer[] = [];

  isEdit: boolean = false;

  sexOption: string[] = SEX_OPTION;

  minDate: { year: number; month: number; day: number; };
  maxDate: { year: number; month: number; day: number; };

  actionRole: {
    edit: boolean
  } = {
    edit: false
  };

  validateForm = validateForm;
  regexEmail = regexEmail;
  formatPhoneNumber = formatPhoneNumber;

  constructor(
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService
  ) { }

  ngOnInit(): void {
    this.onLoadRoleStaff();
    this.onLoadCustomers();
    this.getLimitedDate();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.customerForm = this.createCustomerForm();
    this.onCreateContent();
    this.onChangeFlagPhoneContact(this.customer.isPhoneContact);
  }
  onChangeFlagPhoneContact = (isPhoneContact: boolean) => {
    if (isPhoneContact) {
      this.customerForm.get('tel').setAsyncValidators([]); // or clearValidators()
    } else {
      this.customerForm.get('tel').setAsyncValidators(this.validIncludeTel.bind(this));
    }
    this.customerForm.get('tel').updateValueAndValidity();
  }
  onLoadCustomers = ():void => {
    this.store.dispatch(loadCustomers());
    this.store.select(state => state.customer.customerList)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe( staff => staff && (this.customers = staff));
  }

  onLoadRoleStaff = () => {
    this.store.select(state => state.role.roleStaffLogin)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((role) => {
        if (!role) return;
        this.store.select(state => state.staff.staffLogin)
          .pipe(takeUntil(this.destroy.destroySub$))
          .subscribe((staff: any) => {
            if (!staff) return;
            this.actionRole.edit = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Hồ sơ bệnh án' && x.dataAccessName === 'Cập nhật');
          })
      })
  }

  createCustomerForm = ():FormGroup => {
    return this.formBuilder.group({
      _id: [this.customer?._id],
      customerCode: [this.customer?.customerCode],
      fullName: [this.customer?.fullName, [Validators.required]],
      address: [this.customer?.address,[Validators.required]],
      tel: [this.customer?.tel, [regexFormTel,Validators.required], this.validIncludeTel.bind(this)],
      birthday: [this.datePipe.transform(this.customer?.birthday, 'dd-MM-yyyy'), [Validators.required]],
      email: [this.customer?.email, [regexFormEmail]],
      note: [this.customer?.note],
      sex: [this.customer?.sex],
      isPhoneContact: [this.customer?.isPhoneContact]
    })
  }

  onCreateContent = ():void => {
    this.isEdit = false;
    this.customerInfo = [
      {label: 'Mã bệnh nhân', value: this.customer.customerCode, isUpdate: false, formName: 'customerCode', disabled: true},
      {label: 'Họ tên', value: this.customer.fullName, isUpdate: false, formName: 'fullName', require: true},
      {label: 'Địa chỉ', value: this.customer.address, isUpdate: false, formName: 'address', require: true},
      {label: 'Số điện thoại', value: formatPhoneNumber(this.customer.tel), isUpdate: false, formName: 'tel', require: true},
      {label: 'Ngày sinh', value: this.datePipe.transform(this.customer.birthday, 'dd/MM/yyyy'), isUpdate: false, formName: 'birthday', require: true},
      {label: 'Email', value: this.customer.email, isUpdate: false, formName: 'email', require: false},
    ];
    this.medicalInfo = [
      {label: 'Số lần khám', value: this.customer.medicalInfo?.totalMedical},
      {label: 'Tổng tiền đã khám', value: formatCurentcy(Number(this.customer.medicalInfo?.totalMoney))},
      {label: 'Tổng tiền đã trả', value: formatCurentcy(Number(this.customer.medicalInfo?.moneyPaymented))},
      {label: 'Tổng giảm giá', value: formatCurentcy(Number(this.customer.medicalInfo?.totalDiscount))},
      {label: 'Tổng tiền còn nợ', value: formatCurentcy(Number(this.customer.medicalInfo?.moneyPayment))}
    ]
  }

  handleUpdate = ():void => {
    this.isEdit = !this.isEdit;
    this.customerInfo.filter(val => val.isUpdate = !val.isUpdate);
    !this.isEdit && (this.customerForm = this.createCustomerForm());
    this.eventChangeAction.emit(this.isEdit);
  }


  getLimitedDate = () => {
    let day: number = new Date().getDate();
    let month: number = new Date().getMonth() + 1;
    let year: number = new Date().getFullYear();

    this.minDate = {year: year - 100, month:month, day:day};
    this.maxDate = {year: year , month:month, day:day};
  }

  ValidatorTel = (tel: any):Observable<boolean> => {
    let isValid: boolean = this.customers.filter(val => val.customerCode != this.customer.customerCode && (val.tel != this.customer.tel || (val.tel == this.customer.tel && !val.isPhoneContact))).every(val => val.tel !== tel.replaceAll(' ', ''))
    return of(isValid)
  }

  validIncludeTel = (control: AbstractControl):Observable<ValidationErrors | null> => {
    return timer(500)
    .pipe(
      switchMap(() =>
        this.ValidatorTel(control.value)
        .pipe(
          map(isValid => {
            if ( isValid ) {
              return null
            }
            return {
              telDuplicated: true
            }
          }
        )
      ))
    )
  }
}
