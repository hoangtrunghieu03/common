import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import ATAuComplete from 'src/app/shared/components/at-autocomplete/at-autocomplete';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { formatTextLating, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onAdjustMedicalInput, onLoadMedicalSupply, onLoadMedicalSupplyFilter } from 'src/app/store/actions/medicalSupply.action';
import { showNotify } from 'src/app/store/actions/notify.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalSupply from '../../../../../../../at-common/model/MedicalSupply';
import MedicalSupplyReport from '../../../../../../../at-common/model/MedicalSupplyReport';

export enum ADJUST_REASON {
  OUT_OF_DATE = 'Hết hạn sử dụng',
  CORRUPT = 'Hư hỏng',
  LOSE_PRODUCT = 'Mất hàng',
  OTHER = 'Khác'
}

@Component({
  selector: 'at-inventory-supply-adjustment',
  templateUrl: './inventory-supply-adjustment.component.html',
  styleUrls: ['./inventory-supply-adjustment.component.scss'],
})
export class InventorySupplyAdjustmentComponent implements OnInit {
  @Input() columnDef: ColumnDef[] = COL_DEF;
  medicalSupplyList: MedicalSupply[] = [];
  medicalSupplyFilter: MedicalSupply[] = [];
  medicalSupplySelected: MedicalSupply[] = [];
  filters = new MedicalSupplyReport();
  @Input() roomId: string;
  medicalSupplyForm: FormGroup;
  adjustReason: ATAuComplete[] = [];

  validateForm = validateForm;
  scrollToFirstInvalidControl = scrollToFirstInvalidControl;
  validateAllFormFields = validateAllFormFields;

  constructor(
    public activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService
  ) { }

  ngOnInit(): void {
    this.roomId ? this.onLoadSchuduleByRoom() :this.onLoadMedicalSupply();
    this.medicalSupplyForm = this.createInventorySupplyForm();
    this.adjustReason = (Object.values(ADJUST_REASON)).map((item) => (
      { label: item, value: item, _id: item }))
  }
  onLoadSchuduleByRoom() {
    let filter = { ...this.filters.filter }
    filter.roomId = this.roomId;
    this.filters.filter = filter;
    this.store.dispatch(onLoadMedicalSupplyFilter(this.filters));

    this.store.select(state => state.medicalSupply.medicalSupplyFilter)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalSupplyList => {
        if (!medicalSupplyList) return this.medicalSupplyList = [];
        this.medicalSupplyList = medicalSupplyList;
        this.medicalSupplyFilter = _.cloneDeep(medicalSupplyList.slice().sort((a, b) => a.name?.trim()?.localeCompare(b?.name?.trim())));
      })
  }

  createInventorySupplyForm(): FormGroup {
    return this._formBuilder.group({
      reason: [null, [Validators.required]],
      note: [null],
      listSupply: [[]],
      roomId: [this.roomId ? this.roomId : null]
    })
  }

  onLoadMedicalSupply = () => {
    this.store.dispatch(onLoadMedicalSupply());
    this.store.select(state => state.medicalSupply.medicalSupply)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalSupplyList => {
        if (!medicalSupplyList) return this.medicalSupplyList = [];
        this.medicalSupplyList = medicalSupplyList;
        this.medicalSupplyFilter = medicalSupplyList;
      })
  }

  onSelectSupply = (event) => {
    let medicalSupplySelected = [...this.medicalSupplyForm.get('listSupply').value];
    if (medicalSupplySelected.findIndex(x => x.medicalSupplyId === event._id) !== -1) return;

    let supplyDate = { medicalSupplyId: event._id, name: event.name, quantity: event.quantity, qtySupply: 1 };
    if(this.roomId) {
      medicalSupplySelected = [supplyDate]
    } else {
      medicalSupplySelected.push(supplyDate);
    }
    this.medicalSupplyForm.get('listSupply').setValue(medicalSupplySelected);
  }

  onRemoveSupply = (event) => {
    let medicalSupplySelected = [...this.medicalSupplyForm.get('listSupply').value];
    medicalSupplySelected = medicalSupplySelected.filter(x => x.medicalSupplyId !== event.medicalSupplyId);
    this.medicalSupplyForm.get('listSupply').setValue(medicalSupplySelected);
  }

  onSearch = (event): void => {
    this.medicalSupplyFilter = this.medicalSupplyList.filter((tag) => {
      return tag.name && formatTextLating(tag.name).indexOf(formatTextLating(event)) > -1
    })
    this.medicalSupplyFilter = [...this.medicalSupplyFilter];
  }

  onSaveForm = () => {
    if (this.medicalSupplyForm.valid) {
      let medicalSupplySelected = [...this.medicalSupplyForm.get('listSupply').value];
      if (this.roomId && medicalSupplySelected.length > 1) {
        return this.store.dispatch(showNotify({
          notifyType: 'success',
          message: 'Chỉ chọn một vật dụng điều chỉnh'
        }))
      }
      if (medicalSupplySelected.length == 0 || !this.medicalSupplyForm.get('reason').value) {
        return this.store.dispatch(showNotify({
          notifyType: 'success',
          message: 'Vui lòng chọn vật dụng tiêu hao'
        }),)
      };

      medicalSupplySelected = medicalSupplySelected.filter(x => (delete x.name, delete x.quantity));
      this.medicalSupplyForm.get('listSupply').setValue(medicalSupplySelected);

      this.activeModal.close(this.medicalSupplyForm.value);
    }
    validateAllFormFields(this.medicalSupplyForm);
    scrollToFirstInvalidControl(this.medicalSupplyForm);
  }

}

const COL_DEF: Array<ColumnDef> = [
  {
    label: 'Tên vật dụng',
    title: 'name',
    colType: '',
    style: 'text-align: center',
    headerStyle: 'text-align: center',
  },
  {
    label: 'Số lượng tồn kho thực tế ',
    title: 'quantity',
    colType: 'text-align: center',
    style: 'text-align: center',
    headerStyle: 'text-align: center',
  },
  {
    label: 'Số lượng',
    title: 'qtySupply',
    colType: 'text-align: center',
    style: 'width: 150px',
    headerStyle: 'text-align: center',
    canUpdate: true,
    fieldUpdate: 'qtySupply',
    updateType: 'quantity',
    fieldCompare: 'quantity',
  },

];
