import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal, NgbCalendar, NgbDateAdapter, NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import domtoimage from 'dom-to-image';
import { takeUntil } from 'rxjs/operators';
import { CustomDateParserFormatter } from 'src/app/shared/components/at-datepicker/custome-formatDate.service';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { hiddenProgress, showProgress } from 'src/app/store/actions/progress.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Staffs from '../../../../../../at-common/model/Staffs';
import { showNotify } from '../../../store/actions/notify.action';

@Component({
  selector: 'at-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss'],
  providers: [DestroySubsribeService,
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
    CustomDateParserFormatter ]
})
export class ReceiptComponent implements OnInit {

  @Input() bowMakingList = [];
  @Input() typeDeliveryNote: string;

  receiptForm: FormGroup;

  staffs: Staffs[] = [];
  staffLoginId: string = null;
  
  isEdit: boolean = true;

  constructor(
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private _formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    private ngbCalendar: NgbCalendar,
    private dateAdapter: NgbDateAdapter<string>,
    public customerFormatDate: CustomDateParserFormatter
  ) {
    this.receiptForm = this.createForm();
  }

  ngOnInit(): void {
    this.onLoadStaffLogin();
    this.onloadStaff();
  }

  onloadStaff = (): void => {
    this.store.dispatch(loadStaff());
    this.store.select(state => state.staff.staffList)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(staff => {
        this.staffs = staff;
        this.receiptForm = this.createForm();
        let timeout = setTimeout(() => {
          this.onResizeContent();
          clearTimeout(timeout);
        }, 100);
      })
  }

  onLoadStaffLogin = (): void => {
    this.store.select(state => state.authencation._id)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(staffId => staffId && (this.staffLoginId = staffId))
  }

  createForm = (): FormGroup => {
    return this._formBuilder.group({
      typeDeliveryNote: [this.typeDeliveryNote],
      sender: [null], // Id người nhận mẫu
      receiver: [this.getStaffName(this.staffLoginId)], // Id người nhận khí cụ
      dateDelivery: [this.today], // ngày nhận
      content: [this.bowMakingList && this.bowMakingList.length != 0 ? this.onGetConTent() : null],
      image: [null],
      listDeliveryNote: [this.onGetListDeliveryNote()]
    })
  }

  onGetListDeliveryNote = () => {
    if (!this.bowMakingList || this.bowMakingList.length == 0) return [];
    return this.bowMakingList.map((item) => ({ arcScheduleId: item._id, medicalRecordId: item.medicalRecordId, medicalServiceIndicateId: item.medicalServiceIndicateId }));
  }

  onGetConTent = () => {
    let content: string = '';
    this.bowMakingList.forEach((bowMaking, index) => {
      content = content + bowMaking.customerName + ': ' + bowMaking.medicalServiceIndicate + (index != this.bowMakingList.length - 1 ? ', ' : '')
    });
    return content;
  }

  onResizeContent = () => {
    let textEl = document.getElementsByClassName('form-textarea')[0] as HTMLElement;
    if (textEl) {
      textEl.style.height = 'auto';
      textEl.style.height = `${textEl.scrollHeight}px`;
    }
  }

  getStaffName = (staffId: string): string => {
    return this.staffs.find(staff => staff._id === staffId)?.fullName;
  }

  saveImage = (): void => {
    if (this.receiptForm.controls.dateDelivery.errors?.ngbDate) {
      return this.store.dispatch(showNotify({ notifyType: 'success', message: 'Ngày không hợp lệ' }));
    }
    this.store.dispatch(showProgress());
    this.isEdit = false;
    let timeOut = setTimeout(() => {
      let DATA: any = document.getElementById('htmlData');
      domtoimage.toPng(DATA)
      .then((fileBase64) => {
        this.receiptForm.get('image').setValue(fileBase64);
        this.receiptForm.get('dateDelivery').setValue(this.formatDate(this.receiptForm.get('dateDelivery').value));
        this.activeModal.close(this.receiptForm.value);
      }).catch((error) => {
        this.store.dispatch(showNotify({ notifyType: 'success', message: 'Tải ảnh không thành công!' }));
        this.store.dispatch(hiddenProgress());
      });
      clearTimeout(timeOut);
    }, 100);
  }

  get today() {
    return this.dateAdapter.toModel(this.ngbCalendar.getToday())!;
  }

  formatDate = (date: NgbDateStruct | null): string => {
    return date.year + '-' + `0${date.month}`.slice(-2) + '-' + `0${date.day}`.slice(-2);
  }

}