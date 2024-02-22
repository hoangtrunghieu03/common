import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil, filter } from 'rxjs/operators';
import ATAuComplete from 'src/app/shared/components/at-autocomplete/at-autocomplete';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { formatTextLating, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { onLoadMedicalSupply, onLoadMedicalSupplyFilter } from 'src/app/store/actions/medicalSupply.action';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalSupply from '../../../../../../../at-common/model/MedicalSupply';
import { DestroySubsribeService } from '../../../../shared/service/destroySubscribe.service';
import MedicalSupplyExportRequest from '../../../../../../../at-common/model/MedicalSupplyExportRequest';
import { onRemoveMedicalSupplyRequest } from 'src/app/store/actions/medicalSupplyRequest.action';
import { showNotify } from 'src/app/store/actions/notify.action';
import MedicalSupplyReport from '../../../../../../../at-common/model/MedicalSupplyReport';
import * as _ from 'lodash';

@Component({
  selector: 'app-inventory-supply-give-back',
  templateUrl: './inventory-supply-give-back.component.html',
  styleUrls: ['./inventory-supply-give-back.component.scss'],
  providers: [DestroySubsribeService]
})
export class InventorySupplyGiveBackComponent implements OnInit {

  @Input() title: string = 'Xuất vật dụng cho phòng ban';
  @Input() roomId: string = null;
  @Input() medicalSupplyRequest: MedicalSupplyExportRequest = null;
  @Input() medicalSupplyListToRoom: Array<MedicalSupply> = [];
  columnDef: ColumnDef[] = COL_DEF;
  medicalSupplyList: MedicalSupply[] = [];
  medicalSupplyFilter: MedicalSupply[] = [];
  medicalSupplySelected: MedicalSupply[] = [];
  filters = new MedicalSupplyReport();

  medicalSupplyForm: FormGroup;
  rooms: ATAuComplete[] = [];

  staffLoginId: string = null;

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
    this.medicalSupplyForm = this.createInventorySupplyForm();
    this.onLoadSupplyByRoom();
    this.onLoadStaffLogin();
    // this.onLoadRooms();
    // this.onLoadMedicalSupply();
  }
  onLoadSupplyByRoom() {
    let filter = { ...this.filters.filter }
    filter.roomId = this.roomId;
    this.filters.filter = filter;
    this.store.dispatch(onLoadMedicalSupplyFilter(this.filters));

    this.store.select(state => state.medicalSupply.medicalSupplyFilter)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalSupplyList => {
        if (!medicalSupplyList) return this.medicalSupplyList = [];
        let medicalSupplyListData = _.cloneDeep(medicalSupplyList.slice().sort((a, b) => a.name?.trim()?.localeCompare(b?.name?.trim())));
        this.medicalSupplyListToRoom = medicalSupplyListData;
        this.medicalSupplyFilter = medicalSupplyListData;
      })
  }
  createInventorySupplyForm():FormGroup {
    return this._formBuilder.group({
      roomId: [this.roomId, [Validators.required]],
      listSupply: [[]],
    })
  }

  onLoadStaffLogin = ():void => {
    this.store.select(state => state.authencation._id)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe(staffId => staffId && (this.staffLoginId = staffId))
  }


  onSelectSupply = (event) => {
    let medicalSupplySelected = [...this.medicalSupplyForm.get('listSupply').value];
    if (medicalSupplySelected.findIndex(x => x.medicalSupplyId === event._id) !== -1) return;

    let supplyDate = { medicalSupplyId: event._id, name: event.name, quantity: event.quantity, qtySupply: 1 };
    medicalSupplySelected.push(supplyDate);
    this.medicalSupplyForm.get('listSupply').setValue(medicalSupplySelected);
  }

  onRemoveSupply = (event) => {
    let medicalSupplySelected = [...this.medicalSupplyForm.get('listSupply').value];
    medicalSupplySelected = medicalSupplySelected.filter(x => x.medicalSupplyId !== event.medicalSupplyId);
    this.medicalSupplyForm.get('listSupply').setValue(medicalSupplySelected);
  }

  onSearch = (event): void => {
    this.medicalSupplyFilter = this.medicalSupplyListToRoom.filter((tag) => {
      return tag.name && formatTextLating(tag.name).indexOf(formatTextLating(event)) > -1
    })
    this.medicalSupplyFilter = [...this.medicalSupplyFilter];
  }

  onSaveForm = () => {
    if (this.medicalSupplyForm.valid) {
      let medicalSupplySelected = [...this.medicalSupplyForm.get('listSupply').value];

      if (medicalSupplySelected.length == 0) {
        return this.store.dispatch(showNotify({ notifyType: 'success', message: 'Vui lòng chọn vật tư' }));
      };

      if (medicalSupplySelected.some(x => x.quantity < x.qtySupply)) {
        return this.store.dispatch(showNotify({ notifyType: 'success', message: 'Không thể xuất nhiều hơn số lượng hiện có' }));
      }

      medicalSupplySelected = medicalSupplySelected.filter(x => (delete x.name, delete x.quantity));
      this.medicalSupplyForm.get('listSupply').setValue(medicalSupplySelected);

      this.roomId && this.medicalSupplyForm.addControl('staffId', new FormControl(this.staffLoginId));
      this.medicalSupplyRequest && this.medicalSupplyForm.addControl('supplyRequestId', new FormControl(this.medicalSupplyRequest._id));
      this.activeModal.close(this.medicalSupplyForm.value);
    }
    validateAllFormFields(this.medicalSupplyForm);
    scrollToFirstInvalidControl(this.medicalSupplyForm);
  }

  onRemoveSupplyRequest = () => {
    this.medicalSupplyRequest?._id && this.store.dispatch(onRemoveMedicalSupplyRequest(this.medicalSupplyRequest));
    this.activeModal.close();
  }

  getRoomName = (_id: string):string => {
    return this.rooms?.find( room => room._id === _id )?.label;
  }

  getMedicalSupply = (id: string): MedicalSupply => {
    return this.medicalSupplyListToRoom.find(x => x._id == id);
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
    label: 'Số lượng còn lại tại phòng',
    title: 'quantity',
    colType: 'text-align: center',
    style: 'text-align: center',
    headerStyle: 'text-align: center',
  },
  {
    label: 'Số lượng trả',
    title: 'qtySupply',
    colType: 'text-align: center',
    style: 'width: 150px',
    headerStyle: 'text-align: center',
    canUpdate: true,
    fieldUpdate: 'qtySupply',
    fieldCompare: 'quantity',
    updateType: 'quantity',
  },
];
