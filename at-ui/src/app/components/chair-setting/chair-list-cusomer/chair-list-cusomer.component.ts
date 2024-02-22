import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { RoomList } from 'src/app/shared/enum/share.enum';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onUpdateCustomerInChair } from 'src/app/store/actions/chair.action';
import { onGetFilterCustomer } from 'src/app/store/actions/customer.action';
import { onTransferRoomAndResetChair } from 'src/app/store/actions/medicalRecord.action';
import { showNotify } from 'src/app/store/actions/notify.action';
import Chair from '../../../../../../at-common/model/Chair';
import CustomerChair from '../../../../../../at-common/model/CustomerChair';
import Room from '../../../../../../at-common/model/Room';
import { CHAIR_STATUS, ROOM_STATUS } from '../../../../../../at-common/model/enum';
import { RootState } from '../../../store/entities/state.entity';

@Component({
  selector: 'at-chair-list-cusomer',
  templateUrl: './chair-list-cusomer.component.html',
  styleUrls: ['./chair-list-cusomer.component.scss']
})
export class ChairListCusomerComponent implements OnInit {

  @Output() changeTabActiveEvent: EventEmitter<any> = new EventEmitter();
  @Input() chairCol: Array<ColumnDef> = CHAIR_COLDEF;
  @Input() chairActive: Chair = null;
  @Input() isManager: boolean = false;
  chairStatus = CHAIR_STATUS;
  rooms: Room[] = [];

  constructor(
    private modal: NgbModal,
    private store: Store<RootState>,
    private router: Router,
    private destroyService: DestroySubsribeService
  ) { }

  ngOnInit(): void {
    this.store.dispatch(onGetFilterCustomer({ filterCustomer: null }));
    this.onLoadRooms();
  }

  onLoadRooms = ():void => {
    this.store.select(state => state.room.rooms)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe( room => {
      if (!room || room.length == 0) return;
      this.rooms = room;
    })
  }

  onChangeStatusChair = (chair: CustomerChair, status: string) => {
    if (status == CHAIR_STATUS.IN_PROGRESS && this.chairActive.medicalRecord.some(x => x.chairStatus == CHAIR_STATUS.IN_PROGRESS)) {
      return this.store.dispatch(showNotify({ notifyType: 'success', message: 'Ghế đang được sử dụng' }));
    }
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md',
    })
    modal.componentInstance.title = 'Xác nhận';
    if (status == CHAIR_STATUS.AVAILABLE) {
      modal.componentInstance.content = `Xác nhận đưa bệnh nhân rời khỏi ghế`;
    } else {
      modal.componentInstance.content = `Cập nhật trạng thái <b>${status}</b> cho bệnh nhân`;
    }
    modal.result.then(result => {
      if (!result) { return }
      let medicalRecord = {
        _id: chair.medicalRecordId, 
        chair: {
          chairId: this.chairActive._id,
          status: status
        }
      };
      this.store.dispatch(onUpdateCustomerInChair(medicalRecord));
    }).catch(error => {
    })
  }

  onNavigate = (type: string, id: string) => {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        _id: id
      }
    }
    let routerCurrent = null;
    if (type == 'examine') {
      routerCurrent = '/kham-benh/phong-nieng-rang/chi-tiet/I';
    } else if (type == 'medicalRecord') {
      routerCurrent = '/benh-an/I';
    } else {
      routerCurrent = '/benh-an/chi-tiet/I';
    }
    this.router.navigate([routerCurrent], navigationExtras);
  }

  onTransferRoomAndCloseMedicalRecord = (chair: CustomerChair) => {
    if (chair.chairStatus == CHAIR_STATUS.IN_PROGRESS) {
      return this.store.dispatch(showNotify({ notifyType: 'success', message: 'Bệnh nhân đang được thực hiện trên ghế' }));
    }
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Bạn có muốn chuyển trạng thái bệnh nhân thành <b>${ROOM_STATUS.SEE_YOU}</b>`;
    modal.result.then(result => {
      if (!result) { return }
      const roomInfo = {
        _id: chair.medicalRecordId,
        fromRoom: chair.currentRoom,
        toRoom: this.getRoomId()._id,
        toRoomName: this.getRoomId().name,
        roomStatus: ROOM_STATUS.SEE_YOU
      }
      this.store.dispatch(onTransferRoomAndResetChair(roomInfo));
      // this.changeTabActiveEvent.emit();
    })
  }

  getRoomId = (): Room => {
    return this.rooms?.find(room => room.name == RoomList.reception);
  }

}

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
    label: 'Chỉ định thực hiện',
    title: 'serviceRequest',
  },
  {
    label: 'Trạng thái',
    title: 'chairStatus',
  },
];