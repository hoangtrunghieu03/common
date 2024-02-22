import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { pluck, takeUntil } from 'rxjs/operators';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadChair, onLoadChairById, onRemoveChair, onResetChair, onUpdateCustomerInChair } from 'src/app/store/actions/chair.action';
import { onMedicalCustomerChair } from 'src/app/store/actions/medicalRecord.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import Chair from '../../../../../../at-common/model/Chair';
import CustomerChair from '../../../../../../at-common/model/CustomerChair';
import { CHAIR_STATUS } from '../../../../../../at-common/model/enum';
import Staffs from '../../../../../../at-common/model/Staffs';
import { onUpdateChair } from '../../../store/actions/chair.action';
import { RootState } from '../../../store/entities/state.entity';
import { showNotify } from 'src/app/store/actions/notify.action';

@Component({
  selector: 'app-chair-setting-detail',
  templateUrl: './chair-setting-detail.component.html',
  styleUrls: ['./chair-setting-detail.component.scss']
})
export class ChairSettingDetailComponent implements OnInit {

  chairList: Chair[] = [];
  chair: Chair = new Chair();

  staffs: Staffs[] = [];
  staffList: {label: string, value: string | any}[] = [];
  isEdit: boolean = false;

  chairForm: FormGroup;

  validateForm = validateForm;

  constructor(
    public location: Location,
    private router: ActivatedRoute,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private formBuilder: FormBuilder,
    private modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.chairForm = this.creatChairForm();
    this.onLoadStaffs();
    this.onloadChair();
    this.router.queryParams
      .pipe(pluck('_id'))
      .subscribe(param => param && this.onLoadChairItem(param))
  }

  onLoadChairItem = (_id: string): void => {
    this.store.dispatch(onLoadChairById({ _id: _id }));
    this.store.select(state => state.chair.chairItem)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(chair => {
        if (!chair) { return }
        this.chair = chair;
        this.chairForm = this.creatChairForm();
      })
  }

  onloadChair = (): void => {
    this.store.dispatch(onLoadChair());
    this.store.select(state => state.chair.chairList)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(chairList => {
        if (!chairList) return;
        this.chairList = chairList;
      });
  }

  onLoadStaffs = ():void => {
    this.store.dispatch(loadStaff());
    this.store.select(state => state.staff.staffList)
    .subscribe(staff => {
      if (!staff) return;
      this.staffs = staff;
      this.staffList = staff.map((item) => ({ label: item.fullName, value: item._id }))
    })
  }

  creatChairForm = (): FormGroup => {
    return this.formBuilder.group({
      _id: [this.chair?._id],
      chairStatus: [this.chair?.chairStatus],
      staffId: [this.chair?.staffId, [this.validIncludeStaff.bind(this)]],
      name: [this.chair?.name, [Validators.required]],
      medicalRecord: [this.chair.medicalRecord],
    })
  }

  validIncludeStaff = (control: AbstractControl) => {
    if (this.chairList.filter(val => val._id != this.chair._id).some(val => control.value != this.chair.staffId && val.staffId == control.value)) {
      return { staffDuplicated: true }
    }
    return null;
  }

  onSaveForm = () => {
    if (this.chairForm.valid) {
      this.store.dispatch(onUpdateChair(this.chairForm.value));
      this.isEdit = !this.isEdit;
      return;
    }

    validateAllFormFields(this.chairForm);
    scrollToFirstInvalidControl(this.chairForm);
  }

  onResetChair = () => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md',
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Xác nhận làm mới ghế`;
    modal.result.then(result => {
      if (!result) { return }
      this.store.dispatch(onResetChair({ _id: this.chair._id }));
    }).catch(error => {
    })
  }

  onChangeStatusChair = (chair: CustomerChair) => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md',
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Xác nhận đưa bệnh nhân ra khỏi ghế`;
    modal.result.then(result => {
      if (!result) { return }
      let medicalRecord = {
        _id: chair.medicalRecordId,
        chair: {
          chairId: this.chair._id,
          status: CHAIR_STATUS.AVAILABLE
        }
      };
      this.store.dispatch(onUpdateCustomerInChair(medicalRecord));
    }).catch(error => {
    })
  }

  onRemoveChair = () => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md',
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Xác nhận xóa ghế <b>${this.chair.name}</b>`;
    modal.result.then(result => {
      if (!result) { return }
      if (this.chair.medicalRecord.length > 0) {
        return this.store.dispatch(showNotify({notifyType: 'warning',message: 'Ghế đang được sử dụng'}));
      }
      this.store.dispatch(onRemoveChair(this.chair));
    }).catch(error => {
    })
  }

  getStaffName = (staffId: string): string => {
    return this.staffs.find( staff => staff._id === staffId)?.fullName;
  }

  handleUpdate = () => {
    this.isEdit = !this.isEdit;
    !this.isEdit && (this.chairForm = this.creatChairForm());
  }

}
