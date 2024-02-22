import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import MedicalRecord from '../../../../../../at-common/model/MedicalRecord';
import ColumnDef from '../../components/at-base-table/at-base-table.component';
import { ATContent } from '../../data/at.model';
import { formatCurrencyNumber, formatCurentcy, scrollToFirstInvalidControl, validateAllFormFields, validateForm, FormatDateComponent } from '../../functions/function-helper';
import { PrintService } from '../../service/print.service';
import { DatePipe } from '@angular/common';
import { PAYMENT_METHOD } from '../../enum/share.enum';
import { UNIT } from '../../../../../../at-common/model/enum';
import MedicalBaseModel from '../../../../../../at-common/model/MedicalBaseModel';
import { COLDEF_SERVICE } from '../../components/examine-view/fee/fee.component';

@Component({
  selector: 'app-payment-modal',
  templateUrl: './payment-modal.component.html',
  styleUrls: ['./payment-modal.component.scss'],
  providers: [DatePipe, FormatDateComponent]
})
export class PaymentModalComponent implements OnInit {

  colDef = COLDEF_SERVICE;
  contentPayment: ATContent[] = [];
  paymentForm: FormGroup;
  @Input() medicalRecord: MedicalRecord;
  validateForm = validateForm;
  medicalRecordFee: MedicalBaseModel[] = []
  paymentMethod: Array<{ label: string, value: string}> = [];

  units: Array<{label: string, value: string}> = [];

  viewMedicalRecordFee: MedicalBaseModel[] = [];

  constructor(
    public modal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private printService: PrintService,
    private datePipe: DatePipe,
    private formatDate: FormatDateComponent) { }

  ngOnInit(): void {
    this.units = Object.values(UNIT).map(item => ({label: item, value: item}));
    this.paymentForm = this.createPaymentForm();
    this.medicalRecordFee = this.medicalRecord.medicalServiceIndicates?.
      concat(this.medicalRecord?.medicalServices);
    this.contentPayment = [
      { label: 'Tổng', value: this.medicalRecord?.payment?.totalMoney },
      { label: 'Đã thanh toán', value: this.medicalRecord?.payment?.moneyPaymented },
      // { label: 'Tiền giảm giá', value: this.medicalRecord?.payment?.discountAmount },
      // { label: 'Còn lại', value: this.medicalRecord?.payment?.moneyPayment },
    ]
    this.paymentMethod = Object.values(PAYMENT_METHOD).map((item) => ({ label: item, value: item }));
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


  createPaymentForm = (): FormGroup => {
    return this.formBuilder.group({
      moneyCustomerProvide: [null, [Validators.required], this.validCompareMoney.bind(this)],
      paymentDate: [this.datePipe.transform(new Date(), 'dd-MM-yyyy')],
      discountAmount: [this.medicalRecord?.payment?.discountAmount],
      discountUnit: [this.medicalRecord?.payment?.discountUnit],
      discountValue: [this.medicalRecord?.payment?.discountValue],
      moneyPayment: [this.medicalRecord?.payment?.moneyPayment],
      paymentMethod: [PAYMENT_METHOD.cash],
    })
  }

  compareMoney = (moneyCustomerProvide: string | number): Observable<boolean> => {
    let isValid: boolean = (this.medicalRecord?.payment?.moneyPayment -
      (this.medicalRecord?.payment?.discountAmount === 0 ? this.paymentForm.get('discountAmount').value : 0)) >= formatCurrencyNumber(moneyCustomerProvide);
    return of(isValid)
  }

  validCompareMoney = (control: AbstractControl): Observable<ValidationErrors | null> => {
    return timer(500).pipe(
      switchMap(() =>
        this.compareMoney(control.value)
          .pipe(
            map(isValid => {
              if ( isValid ) { return null }
              return { validCompareMoney: true }
        })
      ))
    )
  }

  validCheckMoney(control: AbstractControl) {
    return Number(control.value) == 0 ? {validPaymentMoney: {value: control.value}} : null;
  }

  validCheckPercent(control: AbstractControl) {
    return Number(control.value) > 100 ? { validPercent: true } : null;
  }

  onChangeDiscountValue = (value: string) => {
    if (!value?.trim()) {
      this.paymentForm.get('discountAmount').setValue(0);
    } else {
      if (this.paymentForm.get('discountUnit').value === UNIT.PERCENT && formatCurrencyNumber(value) > 100) {
        this.paymentForm.get('discountValue').setValue(100);
      }
      this.paymentForm.get('discountAmount').setValue(
        this.paymentForm.get('discountUnit').value === UNIT.PRICE ? formatCurrencyNumber(value) :
          (this.medicalRecord?.payment?.totalMoney * Number(value) / 100)
      )
    }
    if ((this.medicalRecord?.payment?.totalMoney - this.medicalRecord?.payment?.moneyPaymented) <= this.paymentForm.get('discountAmount').value) {
      this.paymentForm.get('discountAmount').setValue(this.medicalRecord?.payment?.totalMoney - this.medicalRecord?.payment?.moneyPaymented);
      this.paymentForm.get('moneyPayment').setValue(0);
      return
    }

    let moneyPayment = this.medicalRecord?.payment?.totalMoney - this.paymentForm.get('discountAmount').value - this.medicalRecord?.payment?.moneyPaymented;
    this.paymentForm.get('moneyPayment').setValue(
      moneyPayment >= 0 ? moneyPayment : 0
    )

    this.paymentForm.get('moneyCustomerProvide').updateValueAndValidity();
  }

  onChangeUnit = (unit: string) => {
    this.paymentForm.get('discountUnit').setValue(unit);
    this.paymentForm.get('discountValue').setValue(0);
    this.paymentForm.get('moneyCustomerProvide').setValue(0);
    this.onChangeDiscountValue('0');
    // unit === UNIT.PERCENT && this.paymentForm.controls['discountValue'].setValidators([this.validCheckPercent]);
    // unit === UNIT.PRICE && this.paymentForm.controls['discountValue'].clearValidators();
    // this.paymentForm.controls['discountValue'].updateValueAndValidity();
  }

  onSavePayment = (): void => {
    if (this.paymentForm.valid) {
      let paymentValue = this.paymentForm.value;
      paymentValue.moneyCustomerProvide = formatCurrencyNumber(this.paymentForm.get('moneyCustomerProvide')?.value);
      paymentValue.paymentDate = this.formatDate.formatDate(paymentValue.paymentDate, 'yyyy-MM-dd');
      paymentValue.moneyPayment = paymentValue.moneyCustomerProvide;
      paymentValue.discountValue = !paymentValue.discountValue ? 0 : formatCurrencyNumber(paymentValue.discountValue);

      this.modal.close([{ _id: this.medicalRecord._id, currentPayment: paymentValue}, false]);
    } else {
      validateAllFormFields(this.paymentForm);
      scrollToFirstInvalidControl(this.paymentForm);
    }
  }

  onSavePaymentAndPrint = (): void => {
    if (this.paymentForm.valid) {
      let paymentValue = this.paymentForm.value;
      paymentValue.moneyCustomerProvide = formatCurrencyNumber(this.paymentForm.get('moneyCustomerProvide')?.value);
      paymentValue.paymentDate = this.formatDate.formatDate(paymentValue.paymentDate, 'yyyy-MM-dd');
      paymentValue.moneyPayment = paymentValue.moneyCustomerProvide;
      paymentValue.discountValue = !paymentValue.discountValue ? 0 : formatCurrencyNumber(paymentValue.discountValue);
      this.printService.setPaymentDate(paymentValue.paymentDate);
      this.modal.close([{ _id: this.medicalRecord._id, currentPayment: paymentValue}, true]);
    } else {
      validateAllFormFields(this.paymentForm);
      scrollToFirstInvalidControl(this.paymentForm);
    }
  }

}
