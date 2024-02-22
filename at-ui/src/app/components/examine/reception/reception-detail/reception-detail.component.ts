import { DatePipe, Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { ExaminaFooterComponent } from 'src/app/shared/components/examine-view/examine-footer/examine-footer.component';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DesignatModalComponent } from 'src/app/shared/modal/designat-modal/designat-modal.component';
import { PaymentModalComponent } from 'src/app/shared/modal/payment-modal/payment-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onAddMedicalServiceIndicates, onLoadMedicalRecordById, onMedicalRecordFinish, onMedicalRecordPayment, onReceiveCustomerToRoom, onTransferRoom } from 'src/app/store/actions/medicalRecord.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Customer from '../../../../../../../at-common/model/Customer';
import { ROOM_STATUS } from '../../../../../../../at-common/model/enum';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import Room from '../../../../../../../at-common/model/Room';
import Staffs from '../../../../../../../at-common/model/Staffs';
import { ATContent } from "../../../../shared/data/at.model";
import { formatCurrencyNumber, formatPhoneNumber } from '../../../../shared/functions/function-helper';
import { BracesDetailComponent } from '../../braces/braces-detail/braces-detail.component';

@Component({
  selector: 'app-reception-detail',
  templateUrl: './reception-detail.component.html',
  styleUrls: ['./reception-detail.component.scss'],
  providers: [DestroySubsribeService, DatePipe, BracesDetailComponent]
})
export class ReceptionDetailComponent implements OnInit {

  colDef: Array<ColumnDef> = COLDEF;
  receptionForm: FormGroup;
  contentService: Array<{label: string, price: number}> = [];
  receptionContent: ATContent[];
  customer: Customer = new Customer();
  medicalRecord: MedicalRecord = new MedicalRecord();
  rooms: Room[] = [];
  serviceType: string = null;
  staffs: Staffs[] = [];
  roomStatus = ROOM_STATUS;

  constructor(
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private activeRo: ActivatedRoute,
    private store: Store<RootState>,
    private modal: NgbModal,
    private router: Router,
    public location: Location,
    private destroyService: DestroySubsribeService,
    private bracesDetailComponent: BracesDetailComponent
  ) { }

  ngOnInit(): void {
    this.onLoadStaff();
    this.onLoadRooms();
    this.activeRo.queryParams.subscribe(param => {
      if ( param && param._id ) {
        this.onLoadMedicalRecord(param._id);
        this.serviceType = param.serviceType
      }
    })
  }

  onLoadMedicalRecord = (Id: string):void => {
    this.store.dispatch(onLoadMedicalRecordById({id: Id}));
    this.store.select( state => state.medicalRecord.medicalRecord )
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe(result => {
      if ( !result ) { return }
      this.medicalRecord = result;
      this.onLoadCustomer()
    })
  }

  onLoadCustomer = ():void => {
    this.store.select( state => state.customer.customerItem )
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe(customer => customer && this.onRenderContent(customer))
  }

  onLoadStaff = ():void => {
    this.store.dispatch(loadStaff());
    this.store.select(state => state.staff.staffList)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(staff => staff && (this.staffs = staff))
  }

  onRenderContent = (customer: Customer):void => {
    this.customer = customer;
    this.receptionContent = [
      // {label: 'Mã bệnh nhân', value: this.customer.customerCode},
      {label: 'Họ tên bệnh nhân', value: this.customer.fullName},
      {label: 'Địa chỉ', value: this.customer.address},
      {label: 'Số điện thoại', value: formatPhoneNumber(this.customer.tel)},
      {label: 'Ngày sinh', value: this.datePipe.transform(this.customer.birthday, 'dd/MM/yyyy')},
      {label: 'Phòng chuyển đến', value: this.getRoomName(this.medicalRecord.fromRoom)},
      {label: 'Người chỉ định', value: this.getStaffName(this.medicalRecord.staffId)},
    ]
  }

  onLoadRooms = ():void => {
    this.store.select(state => state.room.rooms)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe(room => room && (this.rooms = room))
  }

  onPayment = ():void => {
    let elModal = {title: null, content: null};
    elModal.title = 'Thanh toán'
    elModal.content = 'Hiện tại bệnh nhân không có phát sinh nào cần thanh toán'
    if (this.medicalRecord?.payment?.moneyPayment === 0) {
      this.onShowModalSelectRoom(elModal.title,elModal.content, false, null)
    } else {
      this.onShowModalPayment();
    }
  }

  onMoveRoom = (footerCompoent: ExaminaFooterComponent): void => {
    this.bracesDetailComponent.onMoveRoom(this.medicalRecord, footerCompoent, true);
  }
  

  onShowModalSelectRoom = (title:string, content: string, route: boolean, room?: string):void => {
    const modal:NgbModalRef = this.modal.open(ConfirmModalComponent,{
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = title;
    modal.componentInstance.content = content;
    modal.result.then(result => {
      if ( !result ) { return}
      if ( route ) {
        let roomSelect: string = this.rooms.find( val => val.name?.toLowerCase() == room.toLowerCase())?._id;
        const transferRoom = {
          _id: this.medicalRecord._id,
          fromRoom: this.medicalRecord.currentRoom,
          toRoom: roomSelect,
          roomName: room,
        };
        this.store.dispatch(onTransferRoom(transferRoom))
      }
    })
  }

  onShowModalPayment = ():void => {
    const modal: NgbModalRef = this.modal.open(PaymentModalComponent, {
      size: 'xl',
      centered: true,
      windowClass: 'modal-commitment',
    });
    modal.componentInstance.medicalRecord = this.medicalRecord;
    modal.result.then(result => {
      if ( !result ) { return }
      this.store.dispatch(onMedicalRecordPayment({medicalRecord: result[0], print: result[1]}))
    }
    ).catch( error => console.log(error))
  }

  onMedicalRecordFinish = (): void => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Hoàn thành';
    modal.componentInstance.content = `Hoàn thành hồ sơ bệnh án bệnh nhân <b>${this.customer?.fullName}</b>`;
    modal.result.then(result => {
      if (!result) { return }
      this.store.dispatch(onMedicalRecordFinish({ _id: this.medicalRecord._id, medicalRecord: this.medicalRecord }));
      this.router.navigate(['kham-benh/phong-tiep-tan']);
    })
  }

  handleAddDesignation(): void {
    const medicalRecordData = _.cloneDeep(this.medicalRecord);
    const modal = this.modal.open(DesignatModalComponent, {
      scrollable: true,
      windowClass: 'service-indicate-modal modal-commitment',
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
    });
    modal.componentInstance.serviceIndicateSelected = medicalRecordData.medicalServiceIndicates;

    modal.result.then(result => {
      if (!result) { return }
      if (result[0]) {
        let serviceData = _.cloneDeep(result[1]);
        serviceData.forEach(val => {
          val.money = formatCurrencyNumber(val.totalMoney);
          val.totalMoney = formatCurrencyNumber(val.totalMoney);
        });
        this.store.dispatch(onAddMedicalServiceIndicates({ _id: this.medicalRecord?._id, medicalServiceIndicatesUpdate: serviceData }));
      }
    }).catch(error => console.log(error))
  }

  getRoomName = (roomId: string): string => {
    return this.rooms.find(room => room._id === roomId)?.name;
  }

  getStaffName = (staffId: string):string => {
    return this.staffs.find(staff => staff._id == staffId)?.fullName;
  }

  onUpdateRoomStatus = () => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Bạn có muốn chuyển trạng thái bệnh nhân thành <b>${this.roomStatus.SEE_YOU}</b>`;
    modal.result.then(result => {
      if (!result) { return }
      let data = { _id: this.medicalRecord._id, roomStatus: this.roomStatus.SEE_YOU };
      this.store.dispatch(onReceiveCustomerToRoom(data));
      this.router.navigate(['kham-benh/phong-tiep-tan']);
    })
  }

  onBackClick = (roomStatus: string) => {
    this.router.navigate(['kham-benh/phong-tiep-tan']);
  }

}

const COLDEF: Array<ColumnDef> = [
  {
    label: 'Tên chỉ định',
    title: 'name',
    style: 'text-align: center',
    headerStyle: 'text-align: center',
  },
  {
    label: 'Phí',
    title: 'money',
    colType: 'money',
    style: 'text-align: center',
    headerStyle: 'text-align: center',
  },
];