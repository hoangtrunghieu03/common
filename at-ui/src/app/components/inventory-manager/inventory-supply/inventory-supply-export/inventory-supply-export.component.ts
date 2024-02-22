import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ATAuComplete from 'src/app/shared/components/at-autocomplete/at-autocomplete';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { formatTextLating, scrollToFirstInvalidControl, validateAllFormFields, validateForm } from 'src/app/shared/functions/function-helper';
import { onLoadMedicalSupply } from 'src/app/store/actions/medicalSupply.action';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalSupply from '../../../../../../../at-common/model/MedicalSupply';
import { DestroySubsribeService } from '../../../../shared/service/destroySubscribe.service';
import MedicalSupplyExportRequest from '../../../../../../../at-common/model/MedicalSupplyExportRequest';
import { onRemoveMedicalSupplyRequest } from 'src/app/store/actions/medicalSupplyRequest.action';
import { showNotify } from 'src/app/store/actions/notify.action';

@Component({
  selector: 'app-inventory-supply-export',
  templateUrl: './inventory-supply-export.component.html',
  styleUrls: ['./inventory-supply-export.component.scss'],
  providers: [DestroySubsribeService]
})
export class  InventorySupplyExportComponent implements OnInit {

  @Input() title: string = 'Xuất vật dụng cho phòng ban';
  @Input() roomId: string = null;
  @Input() medicalSupplyRequest: MedicalSupplyExportRequest = null;

  @Input() columnDef: ColumnDef[] = COL_DEF;
  medicalSupplyList: MedicalSupply[] = [];
  medicalSupplyFilter: MedicalSupply[] = [];
  medicalSupplySelected: MedicalSupply[] = [];

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
    this.onLoadStaffLogin();
    this.onLoadRooms();
    this.onLoadMedicalSupply();
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

  onLoadRooms = (): void => {
    this.store.select(state => state.room.rooms)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(room => {
        this.rooms = room.map((item) => (
          { label: item.name, value: item._id, _id: item._id }))
      })
  }

  onLoadMedicalSupply = () => {
    this.store.dispatch(onLoadMedicalSupply());
    this.store.select(state => state.medicalSupply.medicalSupply)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalSupplyList => {
        if (!medicalSupplyList || medicalSupplyList.length == 0) return this.medicalSupplyList = [];
        this.medicalSupplyList = medicalSupplyList;
        this.medicalSupplyFilter = medicalSupplyList;
        this.medicalSupplyRequest && this.onSetSupplyExport();
      })
  }

  onSetSupplyExport = () => {
    this.medicalSupplyForm.get('roomId').setValue(this.medicalSupplyRequest?.roomId);
    this.medicalSupplyForm.get('listSupply').setValue(
      this.medicalSupplyRequest?.listSupply.map((item) =>
      ({
        ...item,
        name: this.getMedicalSupply(item.medicalSupplyId).name,
        quantity: this.getMedicalSupply(item.medicalSupplyId).quantity,
        requiredQuantity: item?.qtySupply
      }), 0));
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
    this.medicalSupplyFilter = this.medicalSupplyList.filter((tag) => {
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
    return this.medicalSupplyList.find(x => x._id == id);
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
    label: 'Số lượng xuất',
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

