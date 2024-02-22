import { DatePipe, Location } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import ATAuComplete from 'src/app/shared/components/at-autocomplete/at-autocomplete';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { SERVICE_OPTION } from 'src/app/shared/data/examine';
import { SEX_OPTION } from 'src/app/shared/data/setting';
import { RoomList } from "src/app/shared/enum/share.enum";
import { formatCurrencyNumber, FormatDateComponent, formatPhoneNumber, regexEmail, regexFormTel, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { DesignatModalComponent } from 'src/app/shared/modal/designat-modal/designat-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { loadCustomers, onLoadCustomersSearch } from 'src/app/store/actions/customer.action';
import { onCreateMedicalRecord } from 'src/app/store/actions/medicalRecord.action';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Customer from '../../../../../at-common/model/Customer';
import CustomerReport from '../../../../../at-common/model/CustomerReport';
import { SERVICE_REQUEST } from '../../../../../at-common/model/enum';
import { regexFormEmail } from '../../shared/functions/function-helper';
@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss'],
  providers: [DestroySubsribeService, DatePipe, FormatDateComponent]
})
export class ReceiveComponent implements OnInit {
  @ViewChild('atInputDelaySearch') atInputDelaySearch!: ElementRef;
  receiveForm: FormGroup;
  customerForm: FormGroup;
  serviceRequir = SERVICE_OPTION;
  typeServiceRequest = SERVICE_REQUEST;
  validateForm = validateForm;
  regexEmail = regexEmail;
  formatPhoneNumber = formatPhoneNumber;
  roomListEnum = RoomList;
  colDef: Array<ColumnDef> = COLDEF;
  serviceData = [];
  contentService: Array<{label: string, price: number}> = PRICE_SERVICE;
  showService: boolean = false;
  customersComplete: ATAuComplete[] = [];
  telComplete: ATAuComplete[] = [];
  telPattern: string = '^0.*';
  customers: Customer[] = [];
  customerFilter: Array<any> = []
  toDate = new Date();
  sexOption: string[] = SEX_OPTION;
  customerSelected = new Customer();
  receptionRoom: string = null;
  minDate: { year: number; month: number; day: number; };
  maxDate: { year: number; month: number; day: number; };
  textSearch: string = null;
  textId : string = "";
  constructor(
    private _formBuilder: FormBuilder,
    private router: Router,
    private _modal: NgbModal,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private datePipe: DatePipe,
    public location: Location,
    private formatDate: FormatDateComponent,
    private activeRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private elRef: ElementRef
  ) {
    this.customerForm = this.createCustomerForm();
    this.receiveForm = this.createReceiveForm();
  }

  ngOnInit(): void {
    this.onLoadCustomers();
    this.onLoadCustomerSearch(null);
    this.onLoadRoom();
    this.getLimitedDate();
  }
  @HostListener('document:keypress', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      this.textId += event.key;
      // độ dài của id trong mã QRcode
      if(this.textId.length > 24) this.textId = this.textId.slice(-24);
    }
    else{
      this.onSelectCustomer(this.textId)
      this.textId = "";
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      const atInputDelaySearchElement = this.elRef.nativeElement.querySelector('at-input-delay-search');
      if (atInputDelaySearchElement) {
        const inputElement = atInputDelaySearchElement.querySelector('input[type="text"]');
        if (inputElement) {
          inputElement.focus(); // Focus vào phần tử input
        }
      }
    }
  }
  getLimitedDate = () => {
    let day: number = new Date().getDate();
    let month: number = new Date().getMonth() + 1;
    let year: number = new Date().getFullYear();

    this.minDate = {year: year - 100, month:month, day:day};
    this.maxDate = {year: year , month:month, day:day};
  }
  // Validators.pattern(/^[A-Za-zĐđÀ-ỹ ]+$/)
  createCustomerForm = ():FormGroup => {
    return this._formBuilder.group({
      customerCode: [null, [], this.validIncludeCustomer.bind(this, 'customerCode')],
      fullName: [null,[Validators.required]],
      sex: ['Nam'],
      tel: [null, [Validators.required, regexFormTel], this.validIncludeCustomer.bind(this, 'tel')],
      address: [null,[Validators.required]],
      stt: 0,
      birthday: [null, [Validators.required]],
      email: [null, [regexFormEmail]],
      note: [null],
      isPhoneContact: [false]
    })
  }

  createReceiveForm():FormGroup {
    return this._formBuilder.group({
      customerCode: [null],
      customerNote: [null],
      currentRoom: [null],
      fromRoom: [null],
      toRoom: [null],
      serviceType: [null],
      serviceRequest: [null,[Validators.required]],
      medicalServiceIndicates: [[]],
      customer: [this.customerForm.value],
    })
  }

  onLoadCustomers = ():void => {
    this.store.dispatch(loadCustomers());
    this.store.select( state => state.customer.customerList )
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe( customer => {
      if ( !customer ) { return this.customerForm.get('customerCode').setValue('1')}
      this.customers = [...customer];
      this.customersComplete = customer.map((item) => (
        { label: item.fullName, value: item.fullName, _id: item._id }))
      this.telComplete = customer.map((item) => (
        { label: item.tel, value: item.tel, _id: item._id }))
      this.customerForm.get('customerCode').setValue((this.onGetCustomerCodeMax() + 1).toString());
      this.onCheckCustomer();
      this.activeRoute.queryParams.subscribe(param => {
        if (param && param._id) {
          this.onSelectCustomer(param._id);
        }
      });
    })
  }
  onCheckCustomer() {
    this.customerForm.get('tel').setAsyncValidators(this.validIncludeCustomer.bind(this, 'tel'));
    this.customerForm.get('customerCode').setAsyncValidators(this.validIncludeCustomer.bind(this, 'customerCode'));
    this.customerForm.get('tel').updateValueAndValidity();
    this.customerForm.get('customerCode').updateValueAndValidity();
  }
  onLoadCustomerSearch = (valueSearch: string): void => {
    let filters = {
      filter: { name: valueSearch }
    }
    this.store.dispatch(onLoadCustomersSearch(filters));
    this.store.select(state => state.customer.customerSearch)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((customer: CustomerReport) => {
        if (!customer || !customer.reports) { return this.customers = []; }
        this.customerFilter = customer.reports;
      })
  }

  onGetCustomerCodeMax = (): number => {
    if (!this.customers || this.customers.length == 0) return;
    return Math.max.apply(Math, this.customers.map(function (o) { return Number(o.customerCode); }))
  }

  onSearch(event): void {
    this.onLoadCustomerSearch(event);
  }

  onLoadRoom = ():void => {
    this.store.dispatch(onLoadRooms());
    this.store.select(state => state.room.rooms)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe(room => room && ( this.receptionRoom = room.find(val => val.name.toLowerCase() === 'tiếp tân')?._id))
  }

  onSaveForm = (): void => {
    this.receiveForm.get('customer').setValue(this.customerForm.value);
    this.receiveForm.get('currentRoom').setValue(this.receptionRoom);

    let dataReceive = _.cloneDeep(this.receiveForm.value);
    dataReceive.customer.birthday = this.formatDate.formatDate(dataReceive.customer.birthday, 'yyyy-MM-dd');
    dataReceive.customer.tel = dataReceive.customer.tel.replaceAll(' ', '');
    dataReceive.customer.customerCode = !dataReceive.customer.customerCode.trim() ? null : dataReceive.customer.customerCode

    if (!this.customers.some(val => val.customerCode === dataReceive.customer.customerCode)) {
      this.receiveForm.get('customerCode').setValue(null);
    } else {
      this.receiveForm.get('customerCode').setValue(!dataReceive.customerCode.trim() ? null : dataReceive.customerCode);
    }

    this.receiveForm.get('customer').setValue(dataReceive.customer);
    this.store.dispatch(onCreateMedicalRecord(this.receiveForm.value));
    if(!this.customerSelected) this.onLoadCustomers();
  }

  onCheckSchedule = (): void => {
    if (this.receiveForm.valid && this.customerForm.valid) {
      this.onSaveForm();
    } else {
      validateAllFormFields(this.customerForm);
      validateAllFormFields(this.receiveForm);
      scrollToFirstInvalidControl(this.customerForm);
      scrollToFirstInvalidControl(this.receiveForm);
    }
  }

  handleAddDesignation():void {
    const modal = this._modal.open(DesignatModalComponent, {
      scrollable: true,
      windowClass: 'service-indicate-modal modal-commitment',
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
    });

    modal.componentInstance.serviceIndicateSelected = _.cloneDeep(this.serviceData);

    modal.result.then( result => {
      if ( !result ) { return }
      if (result[0]) {
        this.serviceData = result[1].map((item) => ({
          ...item,
          money: formatCurrencyNumber(item.totalMoney),
          totalMoney: formatCurrencyNumber(item.totalMoney),
        }));
        this.receiveForm.get('medicalServiceIndicates').setValue(this.serviceData)
        this.contentService[0].price = this.contentService[2].price = this.serviceData.reduce((sum, item) => (sum += item.totalMoney), 0);
      }
    }).catch( error => console.log(error))
  }

  onSelectCustomer = (customerId: string):void => {
    this.customerSelected = customerId ? this.customers.find( val => val._id === customerId) : new Customer();
    this.receiveForm.get('customerCode').setValue(this.customerSelected.customerCode);
    this.customerForm.patchValue({
      fullName: this.customerSelected.fullName,
      customerCode: this.customerSelected.customerCode,
      address: this.customerSelected.address,
      tel: formatPhoneNumber(this.customerSelected.tel),
      note: this.customerSelected.note,
      sex: this.customerSelected.sex,
      email: this.customerSelected.email,
      stt: this.customerSelected.stt,
      birthday: this.datePipe.transform(this.customerSelected.birthday, 'dd-MM-yyyy'),
      isPhoneContact: this.customerSelected?.isPhoneContact,
    });
    this.receiveForm.get('customer').setValue(this.customerForm.value);
    this.onChangeFlagPhoneContact(this.customerSelected.isPhoneContact);
    this.textSearch = customerId ? this.customerSelected.customerCode + ' - ' + this.customerSelected.fullName + ' - ' + this.customerSelected.tel : '';
    !customerId && this.customerForm.get('customerCode').setValue((this.onGetCustomerCodeMax() + 1).toString());
    this.cdr.detectChanges();
  }



  onNavigateMedicalRecord = (customer) => {

  }

  onSetName = (event, formName: string):void => {
    this.customerForm.get(formName).setValue(event);
    this.customerForm.controls[formName].markAsTouched({ onlySelf: true })
    this.receiveForm.get('customer').setValue(this.customerForm.value)
  }

  validInclude = (fieldName: string): boolean => {
    if (this.customerSelected && ((this.customerSelected.tel && (this.customerForm.get('tel').value.replaceAll(' ', '') === this.customerSelected.tel))
      || (this.customerSelected.customerCode && (this.customerForm.get('customerCode').value === this.customerSelected.customerCode)))) {
      if (fieldName !== 'birthday' && fieldName !== 'tel' && this.customerForm.value[fieldName] === this.customerSelected[fieldName]) return true;
      if (fieldName === 'tel' && this.customerForm.value[fieldName].replaceAll(' ', '') === this.customerSelected[fieldName]) return true;
      if (fieldName === 'birthday' && this.datePipe.transform(this.customerSelected[fieldName], 'd-M-yyyy') === this.formatDate.formatDate(this.customerForm.value[fieldName], 'd-M-yyyy')) return true;
    }
    return false;
  }

  ValidatorCustomer = (formName: string, value: any): Observable<boolean> => {
    let isValid: boolean
    if (formName == 'tel') {
      isValid = this.customers.filter(val => val._id != this.customerSelected._id && !val.isPhoneContact).every(val => val[formName] != value.replaceAll(' ', ''))
    }else{
      isValid = this.customers.filter(val =>val._id != this.customerSelected._id && val).every(val => val[formName] != value.replaceAll(' ', ''))
    }
    return of(isValid)
  }

  validIncludeCustomer = (formName: string, control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(500).pipe(
      switchMap(() =>
        this.ValidatorCustomer(formName, control.value)
          .pipe(
            map(isValid => {
              if (isValid) {
                return null
              }
              if (formName == 'tel') {
                return {
                  telDuplicated: true
                }
              }
              return {
                customerCodeDuplicated: true
              }
            })
          ))
    )
  }

  canDeactivate = ():boolean => {
    return true;
  }

  get today() {
    return this.datePipe.transform(this.toDate, 'dd-MM-yyyy')
  }

  resetForm = (ipName):void => {
    ipName._keySearch = null;
    this.customerForm.get('sex').setValue('Nam')
  }
  onChangeFlagPhoneContact = (isPhoneContact: boolean) => {
    if (isPhoneContact) {
      this.customerForm.get('tel').setAsyncValidators([]); // or clearValidators()
    } else {
      this.customerForm.get('tel').setAsyncValidators(this.validIncludeCustomer.bind(this, 'tel'));
    }
    this.customerForm.get('tel').updateValueAndValidity();
  }


}

const PRICE_SERVICE = [
  { label: 'Tổng', price: 0 },
  { label: 'Đã thanh toán', price: 0 },
  { label: 'Còn lại', price: 0 },
]

const COLDEF: Array<ColumnDef> = [
  {
    label: 'Tên chỉ định',
    title: 'name',
    style: 'text-align: center',
    headerStyle: 'text-align: center'
  },
  {
    label: 'Phí',
    title: 'money',
    colType: 'money',
    style: 'text-align: center',
    headerStyle: 'text-align: center'
  },
];
