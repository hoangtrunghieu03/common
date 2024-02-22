import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { take, takeUntil } from 'rxjs/operators';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { RoomList } from 'src/app/shared/enum/share.enum';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { clearStateCustomer } from 'src/app/store/actions/customer.action';
import { clearStateMedicalRecord } from 'src/app/store/actions/medicalRecord.action';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Chair from '../../../../../../at-common/model/Chair';
import Room from '../../../../../../at-common/model/Room';
import { MEDICAL_SERVICE_STATUS } from '../../../../../../at-common/model/enum';
import { onLoadChair, onLoadChairByStaff } from '../../../store/actions/chair.action';
import { COL_DEF_WAIT_ROOM } from '../general/general.component';

enum FILTER {
  room = 'Phòng chuyển đến',
  chairStatus = 'Trạng thái',
}

export class ActionRole {
  waitExamination: boolean = false;
  waitImplementation: boolean = false;
  chairManager: boolean = false;
  getDetail: boolean = false;
}

@Component({
  selector: 'app-braces',
  templateUrl: './braces.component.html',
  styleUrls: ['./braces.component.scss'],
  providers: [DestroySubsribeService]
})
export class BracesComponent implements OnInit {

  columnDef: Array<ColDef> = COL_DEF_WAIT_ROOM;
  columnDefWaitPerform: Array<ColDef> = COL_DEF_WAIT_PERFORM;
  chairCol: Array<ColumnDef> = CHAIR_COLDEF;
  rooms: Room[] = [];
  medicalServiceStatus = MEDICAL_SERVICE_STATUS;
  conditionData = FILTER;
  chairActive: Chair = null;

  roomList = RoomList;

  actionRole: ActionRole = null;

  activeId: number = null;

  constructor(
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private _modal: NgbModal
  ) {
  }

  ngOnInit(): void {
    this.onLoadRoleStaff();
    this.onLoadRooms();
    this.onloadChairByStaff();
  }

  onLoadRoleStaff = () => {
    this.store.select(state => state.role.roleStaffLogin)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe((role) => {
        if (!role) return;
        this.store.select(state => state.staff.staffLogin)
          .pipe(takeUntil(this.destroyService.destroySub$))
          .subscribe((staff: any) => {
            if (!staff) return;
            this.actionRole = new ActionRole();
            this.actionRole.waitExamination = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Khám bệnh' && x.dataAccessName === 'Niềng răng - Chờ khám');
            this.actionRole.waitImplementation = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Khám bệnh' && x.dataAccessName === 'Niềng răng - Đợi thực hiện');
            this.actionRole.chairManager = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Khám bệnh' && x.dataAccessName === 'Niềng răng - Quản lý ghế');
            this.actionRole.getDetail = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Khám bệnh' && x.dataAccessName === 'Niềng răng - Đợi thực hiện - Xem chi tiết');
            this.onActiveTab();
          })
      })
  }

  onActiveTab = () => {
    let arr = Object.entries(this.actionRole);
    for (let i = 0; i < arr.length; i++) {
      if (arr[i][1]) return this.activeId = i;
    }
  }

  onloadChairByStaff = (): void => {
    this.store.dispatch(onLoadChairByStaff());
    this.store.select(state => state.chair.chairStaff)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(chair => {
        this.chairActive = chair;
      });
  }

  onLoadRooms = (): void => {
    this.store.dispatch(onLoadRooms());
    this.store.select(state => state.room.rooms)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(room => {
        this.rooms = room;
      })
  }

  getRoomId = (): string => {
    return this.rooms?.find(room => room.name == RoomList.braces)?._id;
  }

  getRoomName = (_id: string): string => {
    return this.rooms?.find(room => room._id === _id)?.name;
  }

  ngOnDestroy(): void {
    this.store.dispatch(clearStateCustomer())
    this.store.dispatch(clearStateMedicalRecord());
  }

}

const COL_DEF_WAIT_PERFORM: Array<ColDef> = [
  {
    name: 'Mã bệnh nhân',
    prop: 'customerCode',
    width: 150,
    router: true,
  },
  {
    name: 'Hồ sơ bệnh án',
    prop: 'medicalRecordCode',
    width: 150,
  },
  {
    name: 'Họ tên',
    prop: 'fullName',
    width: 150,
  },
  {
    name: 'Chỉ định thực hiện',
    prop: 'serviceRequest',
    width: 200,
  },
  {
    name: 'Trạng thái',
    prop: 'chairStatus',
    width: 150,
  },
  {
    name: 'Số ghế',
    prop: 'chairName',
    width: 150,
    router: false
  },
];

const CHAIR_COLDEF: Array<ColumnDef> = [
  {
    label: 'Mã bệnh nhân',
    title: 'customerCode',
  },
  {
    label: 'Mã hồ sơ bệnh án',
    title: 'medicalRecordCode',
  },
  {
    label: 'Họ tên',
    title: 'customerName',
  },
  {
    label: 'Trạng thái',
    title: 'chairStatus',
  },
];
