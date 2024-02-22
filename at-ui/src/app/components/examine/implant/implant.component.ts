import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColDef from 'src/app/shared/components/at-table/at-table.component';
import { RoomList } from 'src/app/shared/enum/share.enum';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { clearStateCustomer } from 'src/app/store/actions/customer.action';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Room from '../../../../../../at-common/model/Room';
import { MEDICAL_SERVICE_STATUS } from '../../../../../../at-common/model/enum';
import { ActionRole } from '../braces/braces.component';
import { COL_DEF_WAIT_ROOM } from '../general/general.component';

@Component({
  selector: 'app-implant',
  templateUrl: './implant.component.html',
  styleUrls: ['./implant.component.scss'],
  providers: [DestroySubsribeService]
})
export class ImplantComponent implements OnInit {

  columnDef: Array<ColDef> = COL_DEF_WAIT_ROOM;
  rooms: Room[] = [];
  medicalServiceStatus = MEDICAL_SERVICE_STATUS;

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
            this.actionRole.waitExamination = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Khám bệnh' && x.dataAccessName === 'Implant - Chờ khám');
            this.actionRole.waitImplementation = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Khám bệnh' && x.dataAccessName === 'Implant - Đợi thực hiện');
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

  onLoadRooms = (): void => {
    this.store.dispatch(onLoadRooms());
    this.store.select(state => state.room.rooms)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(room => {
        this.rooms = room;
      })
  }

  getRoomId = (): string => {
    return this.rooms?.find(room => room.name?.toLowerCase() == RoomList.implant?.toLowerCase())?._id;
  }

  ngOnDestroy(): void {
    this.store.dispatch(clearStateCustomer())
  }
}