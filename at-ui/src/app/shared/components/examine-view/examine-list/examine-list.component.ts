import { Component, Input, SimpleChanges } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { RoomList } from 'src/app/shared/enum/share.enum';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { clearStateMedicalRecord, onLoadMedicalRecordFilter, onMedicalCustomerChair } from 'src/app/store/actions/medicalRecord.action';
import { showNotify } from 'src/app/store/actions/notify.action';
import Chair from '../../../../../../../at-common/model/Chair';
import Customer from '../../../../../../../at-common/model/Customer';
import { CHAIR_STATUS } from '../../../../../../../at-common/model/enum';
import MedicalRecordReport from '../../../../../../../at-common/model/MedicalRecordReport';
import Room from '../../../../../../../at-common/model/Room';
import { onGetFilterCustomer } from '../../../../store/actions/customer.action';
import { RootState } from '../../../../store/entities/state.entity';
import { FilterParam } from '../../../data/at.model';
import { GFILTER } from '../../../data/examine';
import { DestroySubsribeService } from '../../../service/destroySubscribe.service';
import ColDef from '../../at-table/at-table.component';

@Component({
  selector: 'at-examine-list',
  templateUrl: './examine-list.component.html',
  styleUrls: ['./examine-list.component.scss']
})
export class ExamineListComponent {

  @Input() columnDef: Array<ColDef> = [];
  @Input() braceWait: boolean = false;
  @Input() chairActive: Chair = null;
  @Input() roomId: string = null;
  @Input() examinationFlag: boolean = false;
  @Input() conditionData = GFILTER;
  @Input() getDetail: boolean = true;
  chairStatus = CHAIR_STATUS;
  filterResult: FilterParam = { condition: 'room', conditionSelect: this.conditionData.room, value: null, fromDate: null, toDate: null };
  renderSelect: Array<any> = [];
  customers: Customer[] | any = [];
  rooms: Room[] = [];
  filters = new MedicalRecordReport();

  constructor(
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private modal: NgbModal,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.onLoadRooms();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.roomId && this.onLoadCustomerInRoom();
  }

  onLoadRooms = (): void => {
    this.store.select(state => state.room.rooms)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(room => {
        this.rooms = room;
      })
  }

  onLoadCustomerInRoom = (): void => {
    this.customers = [];
    let filter = { ...this.filters.filter }
    filter.currentRoom = this.roomId;
    filter.examinationFlag = this.examinationFlag;
    this.filters.filter = filter;
    this.store.dispatch(onLoadMedicalRecordFilter(this.filters));
    this.store.dispatch(onGetFilterCustomer({ filterCustomer: _.cloneDeep(this.filters) }));

    this.store.select(state => state.medicalRecord.medicalRecordFilter)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(customer => {
        if (!customer || !customer?.reports) return this.customers = [];
        (this.customers = customer?.reports.map((item: any) =>
        ({
          _id: item.medicalRecordId,
          customerCode: item.customerCode,
          medicalRecordCode: item.medicalRecordCode,
          fullName: item.fullName,
          birthday: item.birthday,
          chairName: item.chairName,
          chairStatus: item.chairStatus,
          fromRoomName: item.fromRoomName,
          examinationFlag: item['examinationFlag'],
          serviceRequest: item['serviceRequest'],
          serviceType: item.serviceType,
          currentRoom: item.currentRoom,
          stt: item.stt,
          note: item.noteTranfer,
        }), 0))
      })

  }

  onSearch = (event): void => {
    let filter = { ...this.filters.filter }
    filter.name = event;
    this.filters.filter = filter;
    this.onLoadCustomerInRoom();
  }

  onFilterConditionChange = (): void => {
    Object.entries(this.conditionData).map(([key, value]) => {
      if (this.filterResult.condition === key) {
        this.filterResult.conditionSelect = value;
      }
    })
    this.filterResult.value = null;
  }

  onAddCondiotion = (): void => {
    if (this.filterResult.condition && this.filterResult.value) {
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
      let filter = { ...this.filters.filter }
      if (this.filterResult.conditionSelect == this.conditionData.room) {
        filter.fromRoom = this.filterResult.value;
      } else {
        filter.chairStatus = this.filterResult.value;
      }
      this.filters.filter = filter;
      this.onLoadCustomerInRoom();
    }
  }

  onRemoveFilter = (param): void => {
    this.renderSelect = this.renderSelect.filter(x => x.key != param.key);
    let filter = { ...this.filters.filter }
    if (param.firstCondition == this.conditionData.room) {
      filter.fromRoom = null;
    } else {
      filter.chairStatus = null;
    }
    this.filters.filter = filter;
    this.onLoadCustomerInRoom();
  }

  onSelectChair = (medicalRecord) => {
    if (!this.chairActive) {
      return this.store.dispatch(showNotify({ notifyType: 'success', message: 'Bạn cần cài đặt ghế trước khi sử dụng' }));
    }
    if (this.chairActive.chairStatus == CHAIR_STATUS.IN_PROGRESS || this.chairActive.medicalRecord?.some(x => x.chairStatus == CHAIR_STATUS.IN_PROGRESS)) {
      return this.store.dispatch(showNotify({ notifyType: 'success', message: 'Ghế đang được sử dụng' }));
    }
    if (medicalRecord.chairName && medicalRecord.chairStatus != CHAIR_STATUS.WAIT && medicalRecord.chairStatus != CHAIR_STATUS.FINISH) {
      return this.store.dispatch(showNotify({ notifyType: 'success', message: 'Bệnh nhân hiện tại đã có ghế' }));
    }
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md',
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = ` Xác nhận đưa bệnh nhân vào ghế <b>${this.chairActive.name}</b>`;
    modal.result.then(result => {
      if (!result) { return }
      let medicalRecordData = {
        _id: medicalRecord._id,
        chair: {
          chairId: this.chairActive._id,
          status: CHAIR_STATUS.WAITING_PROCESS
        }
      };
      this.store.dispatch(onMedicalCustomerChair(medicalRecordData));
    }).catch(error => {
    })
  }

  onSelectRow(row) {
    if (this.getDetail && row.examinationFlag && this.getRoomName(row.currentRoom) == RoomList.braces) return;
    let navigationExtras: NavigationExtras = {
      queryParams: {
        _id: row._id
      }
    }

    let routerCurrent = this.router.url + (row?.examinationFlag || row.serviceType != this.getRoomName(this.roomId) ? '/chi-tiet/I' : '/I');
    this.router.navigate([routerCurrent], navigationExtras);
  }

  onCheckChairEnter = (medicalRecord) => {
    if (medicalRecord.chairName && medicalRecord.chairStatus != CHAIR_STATUS.WAIT) return true;
    return false;
  }

  onCheckHideColumn = () => {
    return this.customers.some(x => x.chairStatus == CHAIR_STATUS.WAIT);
  }

  getRoomName = (_id: string): string => {
    return this.rooms?.find(room => room._id === _id)?.name;
  }

  ngOnDestroy(): void {
    this.store.dispatch(clearStateMedicalRecord());
  }
}
