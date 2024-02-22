import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { FilterParam } from 'src/app/shared/data/at.model';
import { GFILTER } from 'src/app/shared/data/examine';
import { RoomList } from 'src/app/shared/enum/share.enum';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onGetFilterCustomer } from 'src/app/store/actions/customer.action';
import { clearStateMedicalRecord, onLoadMedicalRecordFilter } from 'src/app/store/actions/medicalRecord.action';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Customer from '../../../../../../at-common/model/Customer';
import MedicalRecordReport from '../../../../../../at-common/model/MedicalRecordReport';
import Room from '../../../../../../at-common/model/Room';

@Component({
  selector: 'app-designat',
  templateUrl: './designat.component.html',
  styleUrls: ['./designat.component.scss'],
  providers: [DestroySubsribeService]
})
export class DesignatComponent implements OnInit {

  columnDef: Array<ColDef> = COL_DEF;
  conditionData = GFILTER;
  renderSelect: Array<any> = [];
  filterResult: FilterParam = {condition: 'room', conditionSelect: this.conditionData.room, value: null, fromDate: null, toDate: null}
  rooms: Room[] = [];
  filters = new MedicalRecordReport();
  customerDesignation: Customer[] | any = [];

  roomList = RoomList;

  constructor(
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private _modal: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.onLoadRooms();
  }

  onLoadRooms = ():void => {
    this.store.dispatch(onLoadRooms());
    this.store.select(state => state.room.rooms)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe( room => {
      if (!room || room.length == 0) return this.customerDesignation = [];
      this.rooms = room;
      this.onLoadCustomerInGeneralRoom()
    })
  }

  onLoadCustomerInGeneralRoom = (): void => {
    let filter = { ...this.filters.filter }
    filter.currentRoom = this.getRoomId();
    this.filters.filter = filter;
    this.store.dispatch(onLoadMedicalRecordFilter(this.filters));
    this.store.dispatch(onGetFilterCustomer({ filterCustomer: _.cloneDeep(this.filters) }));
    this.store.select(state => state.medicalRecord.medicalRecordFilter)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(customer => customer &&
        (this.customerDesignation = customer?.reports.map((item: any) =>
        ({
          _id: item.medicalRecordId,
          customerCode: item.customerCode,
          fullName: item.fullName,
          birthday: item.birthday,
          indicater: item.indicater,
          fromRoomName: item.fromRoomName,
          stt: item.stt,
          note: item.noteTranfer
        }), 0)))
  }

  onSearch(event):void {
    let filter = {...this.filters.filter}
    filter.name = event;
    this.filters.filter = filter;
    this.onLoadCustomerInGeneralRoom();
  }

  // onFilterConditionChange = ():void => {
  //   Object.entries(GENERAL_FILTER).map(([key, value]) => {
  //     if (this.filterResult.condition === key) {
  //       this.filterResult.conditionSelect = value;
  //     }
  //   })
  //   this.filterResult.value = null;
  // }

  onAddCondiotion = ():void => {
    if ( this.filterResult.condition && this.filterResult.value ) {
      let newFilter = {
        id: Date.now(),
        key: this.filterResult.condition,
        firstCondition: this.filterResult.conditionSelect,
        secondCondition: this.filterResult.value,
      }
      let isIncludes = this.renderSelect.findIndex(item => item.key === newFilter.key);
      if (isIncludes === -1) {
        this.renderSelect.push(newFilter);
      } else {
        this.renderSelect.splice(isIncludes, 1, newFilter);
      }
      let filter = {...this.filters.filter}
      filter.fromRoom = this.filterResult.value;
      this.filters.filter = filter;
      this.onLoadCustomerInGeneralRoom();
    }
  }

  getRoomId = ():string => {
    return this.rooms?.find(room => room.name == RoomList.designat)?._id;
  }

  getRoomName = (_id: string):string => {
    return this.rooms?.find( room => room._id === _id )?.name;
  }

  onRemoveFilter = (param):void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
    let filter = {...this.filters.filter}
    filter.fromRoom = null;
    this.filters.filter = filter;
    this.onLoadCustomerInGeneralRoom();
  }

  ngOnDestroy(): void {
    this.store.dispatch(clearStateMedicalRecord());
  }
}

const COL_DEF: Array<ColDef> = [
  {
    name: 'Mã bệnh nhân',
    prop: 'customerCode',
    width: 150,
    router: true,
  },
  {
    name: 'Họ tên',
    prop: 'fullName',
    width: 150,
  },
  {
    name: 'Ghi chú',
    prop: 'note',
    width: 150,
  },
  {
    name: 'Phòng chuyển đến',
    prop: 'fromRoomName',
    width: 200,
  },
  {
    name: 'Người chỉ định',
    prop: 'indicater',
    width: 200,
  },
];