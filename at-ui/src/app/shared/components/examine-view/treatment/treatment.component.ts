import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { formatTextLating } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { onAddTreatmentProcess, onDeleteTreatmentProcess, onFinishTreatmentProcess, onUpdateTreatmentProcess } from 'src/app/store/actions/medicalRecord.action';
import { onLoadMedicalService } from 'src/app/store/actions/medicalService.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import MedicalService from '../../../../../../../at-common/model/MedicalService';
import MedicalServiceIndicate from '../../../../../../../at-common/model/MedicalServiceIndicate';
import Room from '../../../../../../../at-common/model/Room';
import Staffs from '../../../../../../../at-common/model/Staffs';
import TreatmentProcess from '../../../../../../../at-common/model/TreatmentProcess';
import { OPERATOR_SERVICE_STATUS } from '../../../../../../../at-common/model/enum';
import { onLoadServiceIndicate } from '../../../../store/actions/serviceIndicate.action';
import { DestroySubsribeService } from '../../../service/destroySubscribe.service';
import ColumnDef from '../../at-base-table/at-base-table.component';
import { TreatmentModalComponent } from './treatment-modal/treatment-modal.component';
import { showNotify } from 'src/app/store/actions/notify.action';

@Component({
  selector: 'at-treatment',
  templateUrl: './treatment.component.html',
  styleUrls: ['./treatment.component.scss'],
  providers: [DestroySubsribeService]
})
export class TreatmentComponent implements OnInit {

  columnDef:Array<ColumnDef> = TREAMENT_COLDEF;

  staffs: Staffs[] = [];
  rooms: Room[] = [];

  @Input() medicalRecordData: MedicalRecord;
  @Input() showTitle: boolean = true;
  @Input() showAction: boolean = true;
  @Input() emptyMessage: string = 'Không có dữ liệu';

  medicalService: MedicalService[] = [];
  medicalServiceIndicate: MedicalServiceIndicate[] = [];

  treatmentProcess: TreatmentProcess[] = [];
  treatmentProcessFilter: TreatmentProcess[] = [];
  medicalServiceStatus = OPERATOR_SERVICE_STATUS;

  textSearch: string = null;
  activeRoomId: string = null;

  actionRole: {
    actionTreatment: boolean,
    deleteTreatment: boolean,
  } = {
    actionTreatment: false,
    deleteTreatment: false
  };

  constructor(
    private store: Store<RootState>,
    private modal: NgbModal,
    private destroy: DestroySubsribeService,
    private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.onLoadRoleStaff();
    this.onLoadMedicalService();
    this.onLoadMedicalServiceIndicate();
    this.onLoadStaffs();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onLoadRooms();
    this.sortTreatmentProcessByDateTime(this.medicalRecordData.treatmentProcesses);
    this.onSearch(this.textSearch);
  }

  onLoadRooms = (): void => {
    this.store.select(state => state.room.rooms)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(room => {
        this.rooms = room;
        this.onGetRoomActive();
      })
  }

  onLoadRoleStaff = () => {
    this.store.select(state => state.role.roleStaffLogin)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((role) => {
        if (!role) return;
        this.store.select(state => state.staff.staffLogin)
          .pipe(takeUntil(this.destroy.destroySub$))
          .subscribe((staff: any) => {
            if (!staff) return;
            this.actionRole.actionTreatment = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Khám bệnh' && x.dataAccessName === 'Thao tác quá trình điều trị');
            this.actionRole.deleteTreatment = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Hồ sơ bệnh án' && x.dataAccessName === 'Cập nhật hồ sơ');
          })
      })
  }

  onLoadStaffs = ():void => {
    this.store.dispatch(loadStaff());
    this.store.select(state => state.staff.staffList)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe(staff => staff && (this.staffs = staff))
  }

  onLoadMedicalService = ():void => {
    this.store.dispatch(onLoadMedicalService());
    this.store.select(state => state.medicalService.medicalServices)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(service => service && ( this.medicalService = service))
  }

  onLoadMedicalServiceIndicate = ():void => {
    this.store.dispatch(onLoadServiceIndicate());
    this.store.select(state => state.serviceIndicate.serviceIndicates)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(service => service && ( this.medicalServiceIndicate = service))
  }

  onGetRoomActive = () => {
    this.activeRoute.queryParams
      .subscribe(param => {
        if (param && param.isUpdate) {
          return this.activeRoomId = this.getRoomId(this.medicalRecordData.serviceType);
        }
        this.activeRoomId = this.medicalRecordData.currentRoom;
      });
  }

  handleTreatmentProcess = (row, isEdit): void => {
    const modal: NgbModalRef = this.modal.open(TreatmentModalComponent, {
      centered: true,
      size: 'lg'
    })
    modal.componentInstance.medicalRecordData = _.cloneDeep(this.medicalRecordData);
    modal.componentInstance.roomId = this.activeRoomId;
    if (isEdit) {
      modal.componentInstance.treatmentProcess = _.cloneDeep(row);
      modal.componentInstance.title = 'Cập nhật quy trình điều trị';
    }
    modal.result.then(result => {
      if (!result) return;
      if (isEdit) return this.store.dispatch(onUpdateTreatmentProcess({ _id: this.medicalRecordData?._id, treatmentProcess: result }));
      this.store.dispatch(onAddTreatmentProcess({ _id: this.medicalRecordData?._id, treatmentProcess: result }))
    }).catch(error => {
    })
  }

  onFinishRow = (rowData): void => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Đồng ý hoàn thành quá trình điều trị`;
    modal.result.then(result => {
      if (!result) return;
      let processDay : Date = new Date(rowData?.processDay);
      let today: Date = new Date();
      if (processDay <= today) {
        let treatment = { _id: this.medicalRecordData?._id, fromRoom: this.medicalRecordData.currentRoom, treatmentProcess: {id: rowData?.id} };
        this.store.dispatch(onFinishTreatmentProcess(treatment));
      } else {
        this.store.dispatch(showNotify({ notifyType: 'success', message: 'Chưa đến ngày thực hiện' }));
      }
    }).catch(error => {
    })
  }

  onDeleteRow = (rowData): void => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Đồng ý xóa quá trình điều trị`;
    modal.result.then(result => {
      if (!result) return;
      let treatment = { _id: this.medicalRecordData?._id, treatmentProcess: rowData?.id };
      this.store.dispatch(onDeleteTreatmentProcess(treatment));
    }).catch(error => {
    })
  }

  onSearch(event): void {
    this.textSearch = event;
    this.treatmentProcessFilter = this.treatmentProcess.filter((val) => (event
      ? (val.note && formatTextLating(val.note).indexOf(formatTextLating(event)) > -1)
      : true)
    );
  }

  onSetStaff = (staffId) => {
    if (!staffId || staffId.length == 0) return '--';
    let staffValue = '';
    staffId?.forEach(staff => {
      staffValue = `${staffValue} ${this.getStaffName(staff)} <br>`;
    });
    return staffValue;
  }
  onSetStaffCreate(staffCreateId) {
    if (!staffCreateId) return '--';
    return this.getStaffName(staffCreateId);
  }
  onSetServiceIndicate = (serviceId) => {
    if (!serviceId || serviceId.length == 0) return '--';
    let serviceValue = '';
    serviceId?.forEach(service => {
      serviceValue = `${serviceValue} ${this.getMedicalServiceIndicateName(service)} <br>`;
    });
    return serviceValue;
  }

  onCheckTreatmentDelete = (treament: TreatmentProcess) => {
    if (treament.treatmentStatus !== OPERATOR_SERVICE_STATUS.NOT_FINISH) {
      return this.actionRole.deleteTreatment ? true : false;
    }
    return true;
  }

  getStaffName = (staffId: string): string => {
    return this.staffs.find( staff => staff._id === staffId)?.fullName;
  }

  getMedicalServiceName = (id: string): string => {
    return this.medicalService.find(service => service._id === id)?.name;
  }

  getMedicalServiceIndicateName = (id: string): string => {
    return this.medicalServiceIndicate.find(service => service._id === id)?.name;
  }

  sortTreatmentProcessByDateTime = (arrayData: Array<any>) => {
    // return arrayData.sort((a, b) => Date.parse(a.processDay) - Date.parse(b.processDay));
    let arrayFinish = arrayData.filter(x => x.treatmentStatus === OPERATOR_SERVICE_STATUS.FINISH).sort(
      (a, b) => (Date.parse(a.processDay) - Date.parse(b.processDay))
    );
    let arrayNotFinish = arrayData.filter(x => x.treatmentStatus === OPERATOR_SERVICE_STATUS.NOT_FINISH).sort(
      (a, b) => (Date.parse(a.processDay) - Date.parse(b.processDay))
    );

    this.treatmentProcess = [...arrayNotFinish.concat(arrayFinish)];
    this.treatmentProcessFilter = [...arrayNotFinish.concat(arrayFinish)];
  }

  getRoomId = (roomName): string => {
    return this.rooms?.find(room => room.name == roomName)?._id;
  }

}


export const TREAMENT_COLDEF: Array<ColumnDef> = [
  {
    label: 'Ngày',
    title: 'processDay',
    colType: 'date',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
  {
    label: 'Dịch vụ',
    title: 'serviceId',
    colType: 'service',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
  {
    label: 'Dịch vụ chỉ định',
    title: 'serviceIndicateId',
    colType: 'serviceIndicateId',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
  {
    label: 'Chỉ định thực hiện',
    title: 'note',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
  {
    label: 'Người thực hiện',
    title: 'staffId',
    headerStyle: 'text-align: center',
    style: 'text-align: center',
    colType: 'select',
  },
  {
    label: 'Người tạo',
    title: 'staffCreateId',
    headerStyle: 'text-align: center',
    style: 'text-align: center',
  },
  {
    label: 'Trạng thái',
    title: 'treatmentStatus',
    colType: 'text',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
];
