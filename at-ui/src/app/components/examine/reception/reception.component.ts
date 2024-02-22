import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { FilterParam } from 'src/app/shared/data/at.model';
import { RECEPTION } from 'src/app/shared/data/examine';
import { RoomList } from 'src/app/shared/enum/share.enum';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onGetFilterCustomer } from 'src/app/store/actions/customer.action';
import { clearStateMedicalRecord, onLoadMedicalRecordFilter } from 'src/app/store/actions/medicalRecord.action';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Customer from '../../../../../../at-common/model/Customer';
import MedicalRecordReport from '../../../../../../at-common/model/MedicalRecordReport';
import Room from '../../../../../../at-common/model/Room';
import { ROOM_STATUS } from '../../../../../../at-common/model/enum';

enum FILTER {
  room = 'Phòng chuyển đến',
  roomStatus = 'Trạng thái',
}

@Component({
  selector: 'app-reception',
  templateUrl: './reception.component.html',
  styleUrls: ['./reception.component.scss'],
  providers: [DestroySubsribeService]
})
export class ReceptionComponent implements OnInit {

  columnDef: Array<ColDef> = COL_DEF;
  reception = RECEPTION;
  conditionData = FILTER;
  status = ROOM_STATUS;
  filterResult: FilterParam = {condition: 'room', conditionSelect: this.conditionData.room, value: null, fromDate: null, toDate: null}
  renderSelect: Array<any> = [];
  rooms: Room[] = [];
  filters = new MedicalRecordReport();
  customerReception: Customer[] | any = [];
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
      if (!room || room.length == 0) return this.customerReception = [];
      this.rooms = room;
      this.onLoadCustomerInGeneralRoom()
    })
  }

  onLoadCustomerInGeneralRoom = (): void => {
    let filter = { ...this.filters.filter };
    filter.currentRoom = this.getRoomId();
    this.filters.filter = filter;
    this.store.dispatch(onLoadMedicalRecordFilter(this.filters));
    this.store.dispatch(onGetFilterCustomer({ filterCustomer: _.cloneDeep(this.filters) }));
    this.store.select(state => state.medicalRecord.medicalRecordFilter)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(customer => {
        if (!customer) return;
        // this.customerReception = [...customer?.reports]
        (this.customerReception = customer?.reports.map((item: any) =>
        ({
          _id: item.medicalRecordId,
          customerCode: item.customerCode,
          fullName: item.fullName,
          serviceRequest: this.onSetService(item),
          roomStatus: item.roomStatus + (!item.noteTranfer?.trim() ? '' : (" Và " + item.noteTranfer)),
          stt: item.stt,
        }), 0))
        this.customerReception.sort((a, b) => {
          return Number(a.stt) - Number(b.stt);
        });
      })
  }

  onSearch(event):void {
    let filter = {...this.filters.filter}
    filter.name = event;
    this.filters.filter = filter;
    this.onLoadCustomerInGeneralRoom();
  }

  onFilterConditionChange = ():void => {
    Object.entries(FILTER).map(([key, value]) => {
      if (this.filterResult.condition === key) {
        this.filterResult.conditionSelect = value;
      }
    })
    this.filterResult.value = null;
    this.filterResult.fromDate = null;
    this.filterResult.toDate = null;
  }

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
      if (this.filterResult.conditionSelect == FILTER.room) {
        filter.fromRoom = this.filterResult.value;
      } else {
        filter.roomStatus = this.filterResult.value;
      }
      this.filters.filter = filter;
      this.onLoadCustomerInGeneralRoom();
    }
  }

  onSetService = (item) => {
    if (!item.serviceRequest && !item.serviceType) return '--';
    if (item.serviceRequest && item.serviceType) {
      return `${item.serviceRequest} <br> ${item.serviceType}`;
    } else if (!item.serviceType) {
      return `${item.serviceRequest}`;
    } else {
      return `${item.serviceType}`;
    }
  }

  getRoomId = ():string => {
    return this.rooms?.find(room => room.name == RoomList.reception)?._id;
  }

  getRoomName = (_id: string):string => {
    return this.rooms?.find( room => room._id === _id )?.name;
  }

  onRemoveFilter = (param):void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
    let filter = {...this.filters.filter}
    if (this.filterResult.conditionSelect == FILTER.room) {
      filter.fromRoom = null;
    } else {
      filter.roomStatus = null;
    }
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
    name: 'Số thứ tự',
    prop: 'stt',
    width: 150,
  },
  {
    name: 'Dịch vụ yêu cầu',
    prop: 'serviceRequest',
    width: 150,
    colType: 'innerHTML'
  },
  {
    name: 'Trạng thái',
    prop: 'roomStatus',
    width: 150,
  },
];
