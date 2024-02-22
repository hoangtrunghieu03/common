import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalSupplyExportRequest from '../../../../../../../at-common/model/MedicalSupplyExportRequest';
import Room from '../../../../../../../at-common/model/Room';
import Staffs from '../../../../../../../at-common/model/Staffs';
import { onExportMedicalSupplyRequest } from '../../../../store/actions/medicalSupply.action';
import { onLoadMedicalSupplyRequest } from '../../../../store/actions/medicalSupplyRequest.action';
import { InventorySupplyExportComponent } from '../inventory-supply-export/inventory-supply-export.component';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';

@Component({
  selector: 'app-inventory-supply-request',
  templateUrl: './inventory-supply-request.component.html',
  styleUrls: ['./inventory-supply-request.component.scss']
})
export class InventorySupplyRequestComponent implements OnInit {

  staffs: Staffs[] = [];
  rooms: Room[] = [];

  medicalSupplyRequest: MedicalSupplyExportRequest[] = [];

  columnDef = COL_DEF;

  constructor(
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    public _location: Location,
    private _modal: NgbModal
  ) { }

  ngOnInit(): void {
    this.onLoadSupplyRequest();
    this.onLoadRooms();
    this.onLoadStaffs();
  }

  onLoadSupplyRequest = () => {
    this.store.dispatch(onLoadMedicalSupplyRequest());
    this.store.select(state => state.medicalSupplyRequest.medicalSupplyRequest)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(supplyRequest => {
        if (!supplyRequest) return this.medicalSupplyRequest = [];
        this.medicalSupplyRequest = _.cloneDeep(supplyRequest);
      })
  }

  onLoadRooms = (): void => {
    this.store.dispatch(onLoadRooms());
    this.store.select(state => state.room.rooms)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(room => {
        if (!room) return;
        this.rooms = room;
      })
  }

  onLoadStaffs = (): void => {
    this.store.dispatch(loadStaff());
    this.store.select(state => state.staff.staffList)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(staff => {
        if (!staff) return;
        this.staffs = staff;
      })
  }

  handleEventExport = (supplyRequest) => {
    const modalRef = this._modal.open(InventorySupplyExportComponent, {
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'inventory-backdrop',
      windowClass: 'inventory-window',
      centered: true
    })
    modalRef.componentInstance.medicalSupplyRequest = supplyRequest;
    modalRef.componentInstance.columnDef = COL_DEF_MANGAGER;
    modalRef.result.then(result => {
      if (!result) { return }
      this.store.dispatch(onExportMedicalSupplyRequest(result));
    }).catch(error => { return error })
  }

  getRoomName = (id: string): string => {
    return this.rooms?.find(room => room._id == id)?.name;
  }

  getStaffName = (staffId: string): string => {
    return this.staffs.find(staff => staff._id === staffId)?.fullName;
  }

}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Ngày đề xuất',
    prop: 'createDateTime',
    width: 200,
  },
  {
    name: 'Nhân viên',
    prop: 'staffId',
    width: 200,
  },
  {
    name: 'Phòng',
    prop: 'roomId',
    width: 200,
  },
  {
    name: '',
    prop: 'action',
    width: 80,
  }
];
const COL_DEF_MANGAGER: Array<ColumnDef> = [
  {
    label: 'Tên vật dụng',
    title: 'name',
    colType: '',
    style: 'text-align: center',
    headerStyle: 'text-align: center',
  },
  {
    label: 'Số lượng đề xuất',
    title: 'requiredQuantity',
    colType: 'text-align: center',
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
