import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { onLoadMedicalRecordFilter } from 'src/app/store/actions/medicalRecord.action';
import { onLoadNotification, onUpdateNotification } from 'src/app/store/actions/notification.action';
import MedicalRecordReport from '../../../../../../at-common/model/MedicalRecordReport';
import Notification from '../../../../../../at-common/model/Notification';
import Room from '../../../../../../at-common/model/Room';
import Staffs from '../../../../../../at-common/model/Staffs';
import { RootState } from '../../../store/entities/state.entity';
import { RoomList } from '../../enum/share.enum';
import { DestroySubsribeService } from '../../service/destroySubscribe.service';

@Component({
  selector: 'at-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  providers: [DatePipe, DestroySubsribeService]
})
export class NotificationComponent implements OnInit {

  notificationList: Array<any> = [];
  countNotify: number = 0;

  staffs: Staffs = new Staffs();
  isNewNoti: boolean = false;

  rooms: Room[] = [];

  filtersReports: MedicalRecordReport = new MedicalRecordReport();

  constructor(
    private store: Store<RootState>,
    private datePipe: DatePipe,
    private destroy: DestroySubsribeService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.onLoadRooms();
    this.store.dispatch(onLoadNotification());
    this.onLoadRoomStaffLogin();
    this.onLoadNotification();

    this.store.select(state => state.medicalRecord.medicalRecordFilter)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((filter: MedicalRecordReport) => {
        if (!filter) return this.filtersReports = null;
          this.filtersReports = _.cloneDeep(filter);
          this.filtersReports.reports = [];
      })
  }

  onLoadRooms = ():void => {
    this.store.select(state => state.room.rooms)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe( room => {
      if (!room || room.length == 0) return this.rooms = [];
      this.rooms = room;
    })
  }

  onLoadRoomStaffLogin = () => {
    this.store.select(state => state.staff.staffLogin)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((staff: Staffs) => {
        if (!staff) return;
        this.staffs = staff;
      })
  }

  onLoadNotification = () => {
    this.store
      .select(state => state.notification.notificationList)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(notify => {
        if (notify && notify.length !== 0) return this.notiProcess(notify);
        this.countNotify = 0;
        this.notificationList = [];
      })
  }

  notiProcess = (notify) => {
    this.notificationList = notify.map((item) => { return { ...item, ...{ time: this.getTimeNotify(item.createDateTime) } } });
    this.notificationList = this.notificationList.filter(noti => this.staffs?.roomIds.some(roomId => roomId === noti.roomId));

    if (this.staffs?.roomIds.some(roomId => roomId === notify[0].roomId) && this.notificationList.length !== 0) {
      if ((this.router.url == this.onGetRouterLink(notify[0]?.roomName) || this.router.url == this.onGetRouterLink(notify[0]?.fromRoomName)) && this.staffs?._id !== notify[0]?.fromStaffId && this.filtersReports) {
        this.store.dispatch(onLoadMedicalRecordFilter(this.filtersReports));
      }

      if(notify[0].fromStaffId !== this.staffs._id){
        this.isNewNoti = true;
      }
      if(this.isNewNoti){
        let timeOut = setTimeout(() => {
          this.isNewNoti = false;
          clearTimeout(timeOut);
        }, 3000);
      }
    }

    this.countNotify = this.notificationList.reduce((count, val) => {
      if (!val.markRead) { count += 1 }
      return count;
    }, 0)
  }

  getTimeNotify = (createDateTime: any): string => {
    if (!createDateTime) return '--';
    var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    let dayTimeCurrent = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);

    let serviceTime = new Date(dayTimeCurrent.split('.')[0]).getTime() - new Date(createDateTime.split('.')[0]).getTime();
    var days = Math.floor(serviceTime / (60 * 60 * 24 * 1000));
    var hours = Math.floor(serviceTime / (60 * 60 * 1000)) - (days * 24);
    var minutes = Math.floor(serviceTime / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    if (days < 0) return '00:00';
    return `${`0${hours}`.slice(-2)}:${`0${minutes}`.slice(-2)}`;
  }

  changeStatusNotify = (notify: Notification, isNavigate: boolean) => {
    if (!notify.markRead) {
      this.store.dispatch(onUpdateNotification({ _id: notify._id }));
    }
    if (isNavigate) return this.handleNavigateRoom(notify.roomName);
  }

  handleNavigateRoom = (roomName: string): void => {
    // if (this.router.url == this.onGetRouterLink(roomName)) {
    //   return this.store.dispatch(onLoadMedicalRecordFilter(this.filtersReports));
    // }
    this.router.navigate([this.onGetRouterLink(roomName)])
  }

  onGetRoomId = (roomName: string): string => {
    return this.rooms?.find(room => room.name == roomName)?._id;
  }

  onGetRoomName = (id: string): string => {
    return this.rooms?.find(room => room._id == id)?.name;
  }

  onGetRouterLink = (roomName: string) => {
    return ROUTER_EXAMINE.find(routerExamine => routerExamine.roomName == roomName)?.routerLink;
  }

}

const ROUTER_EXAMINE = [
  { roomName: RoomList.minorsurgery, routerLink: '/kham-benh/phong-tieu-phau' },
  { roomName: RoomList.implant, routerLink: '/kham-benh/phong-cay-implant' },
  { roomName: RoomList.designat, routerLink: '/kham-benh/phong-chi-dinh' },
  { roomName: RoomList.braces, routerLink: '/kham-benh/phong-nieng-rang' },
  { roomName: RoomList.reception, routerLink: '/kham-benh/phong-tiep-tan' },
  { roomName: RoomList.general, routerLink: '/kham-benh/phong-tong-quat' },
]
