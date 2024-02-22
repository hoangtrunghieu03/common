import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onCreateChair, onLoadChair } from 'src/app/store/actions/chair.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import Chair from '../../../../../../at-common/model/Chair';
import { CHAIR_STATUS, STATUS_STAFF } from '../../../../../../at-common/model/enum';
import Staffs from '../../../../../../at-common/model/Staffs';
import { RootState } from '../../../store/entities/state.entity';

@Component({
  selector: 'app-chair-setting-modal',
  templateUrl: './chair-setting-modal.component.html',
  styleUrls: ['./chair-setting-modal.component.scss']
})
export class ChairSettingModalComponent implements OnInit {

  chairForm: FormGroup;
  chairList: Chair[] = [];
  chair: Chair = new Chair();

  staffs: Staffs[] = [];
  staffList: {label: string, value: string | any}[] = [];

  validateForm = validateForm;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.chairForm = this.creatChairForm();
    this.onloadChair();
    this.onLoadStaffs();
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
      let staffActive = staff.filter(staff => !staff.status || staff.status == STATUS_STAFF.ACTIVE);
      this.staffList = staffActive.map((item) => ({ label: item.fullName, value: item._id }))
    })
  }

  creatChairForm = (): FormGroup => {
    return this.formBuilder.group({
      chairStatus: [CHAIR_STATUS.AVAILABLE],
      staffId: [null, [this.validIncludeStaff.bind(this)]],
      name: [null, [Validators.required]],
      staffName: [null]
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
      this.chairForm.get('staffName').setValue(this.getStaffName(this.chairForm.get('staffId').value))
      this.store.dispatch(onCreateChair(this.chairForm.value));
      this.activeModal.close();
      return;
    }

    validateAllFormFields(this.chairForm);
    scrollToFirstInvalidControl(this.chairForm);
  }

  getStaffName = (staffId: string): string => {
    return this.staffs.find( staff => staff._id === staffId)?.fullName;
  }

}
