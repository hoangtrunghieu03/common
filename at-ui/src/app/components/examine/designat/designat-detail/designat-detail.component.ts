import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { pluck, switchMap, takeUntil } from 'rxjs/operators';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { ExaminaFooterComponent } from 'src/app/shared/components/examine-view/examine-footer/examine-footer.component';
import { ATContent } from 'src/app/shared/data/at.model';
import {  TREAMENT_ITEM_DATA } from 'src/app/shared/data/examine';
import { formatCurentcy } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { clearStateMedicalRecord, onLoadMedicalRecordById, onMedicalRecordNote, onMedicalSICommand, onReceiveCustomerToRoom, onTransferRoom } from 'src/app/store/actions/medicalRecord.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalImageModel from '../../../../../../../at-common/model/MedicalImageModel';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import Staffs from '../../../../../../../at-common/model/Staffs';
import { DesignatBlockModalComponent } from '../designat-modal/designat-modal.component';
import * as _ from 'lodash';
import Customer from '../../../../../../../at-common/model/Customer';
import { onLoadCustomerByCode } from 'src/app/store/actions/customer.action';
import { pipe } from 'rxjs';
import { IndicateImageModel, ScreenImage, UploadImageService } from 'src/app/store/services/uploadImages.service';
import { onLoadServiceIndicateById } from 'src/app/store/actions/serviceIndicate.action';
import { ScheduleModalComponent } from 'src/app/shared/modal/schedule-modal/schedule-modal.component';
import { onCreateMedicalSchedule } from 'src/app/store/actions/medicalSchedule.action';
import { ROOM_STATUS } from '../../../../../../../at-common/model/enum';
import { RoomList } from 'src/app/shared/enum/share.enum';
import { BracesDetailComponent } from '../../braces/braces-detail/braces-detail.component';
import MedicalBaseModel from '../../../../../../../at-common/model/MedicalBaseModel';

@Component({
  selector: 'app-designat-detail',
  templateUrl: './designat-detail.component.html',
  styleUrls: ['./designat-detail.component.scss'],
  providers: [DestroySubsribeService, BracesDetailComponent]
})
export class DesignatDetailComponent implements OnInit {

  designatContent: (ATContent & {class: string})[] = [];
  servicePaymentContent: ATContent[]=[];
  columnDef:Array<ColumnDef> = TREAMENT_COLDEF;
  indexSelected: number = null;
  staffs: Staffs[] = [];
  treamentData = TREAMENT_ITEM_DATA;
  designatCol: ColumnDef[] = DESIGNAT_COLDEF;
  medicalRecordDesignat: MedicalRecord = new MedicalRecord();
  medicalServiceIndicates: MedicalBaseModel[] = [];
  customer = new Customer();
  deleteImg: boolean;
  screenImage = ScreenImage;
  actionRole: {
    deleteImg: boolean,
  } = {
      deleteImg: false,
    };

  constructor(
    public location: Location,
    private router: Router,
    private modal: NgbModal,
    private store: Store<RootState>,
    private rout: ActivatedRoute,
    private destroy: DestroySubsribeService,
    private uploadImgService: UploadImageService,
    private braceDetailComponent: BracesDetailComponent,
    private destroyService: DestroySubsribeService,
    ) { }

  ngOnInit(): void {
    this.onLoadStaffs();
    this.rout.queryParams
      .pipe(pluck('_id'))
      .subscribe(param => param && this.onLoadMedicalRecordDesignat(param))
    this.designatContent = [
      {label: 'Lý do đến khám', value: 'Đau răng, buốt răng,...', class: ''},
      {label: 'Bệnh sử y khoa', value: 'Bệnh đông máu, tim mạch,...', class: ''},
      {label: 'Tiền sử bản thân', value: 'nghiện rượu,...', class: ''},
      {label: 'Triệu chứng y khoa', value: null, class: 'd-flex flex-column'},
      {label: 'Chẩn đoán', value: null, class: 'd-flex flex-column'},
      {label: 'Điều trị', value: null, class: 'd-flex flex-column'},
      {label: 'Lời khuyên', value: null, class: 'd-flex flex-column'},
    ]
    this.onLoadRoleStaff();
  }

  onLoadMedicalRecordDesignat = (medicalId:string):void => {
    this.store.dispatch(onLoadMedicalRecordById({id: medicalId}));
    this.store.select(state => state.medicalRecord.medicalRecord)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe(medicalRecord => {
      if ( !medicalRecord ) { return }
      this.medicalRecordDesignat = _.cloneDeep(medicalRecord);
      this.onLoadPaymentInfo(this.medicalRecordDesignat?.payment)
      this.onLoadCustomer();
      this.onGetMedicalServiceIndicate();
    })
  }

  onLoadCustomer = ():void => {
    this.store.select( state => state.customer.customerItem)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe( customer => customer && (this.customer = customer));
  }

  onLoadPaymentInfo = (paymentInfo):void => {
    this.servicePaymentContent = [
      {label: 'Tổng', value: formatCurentcy(paymentInfo?.medicalServiceMoney)},
      {label: 'Đã thanh toán', value: formatCurentcy(paymentInfo?.moneyPaymented)},
      {label: 'Còn lại', value: formatCurentcy(paymentInfo?.medicalServiceMoney - paymentInfo?.moneyPaymented)},
    ]
  }

  onLoadStaffs = ():void => {
    this.store.dispatch(loadStaff());
    this.store.select(state => state.staff.staffList)
    .subscribe(staff => {
      if (!staff) return;
      this.staffs = staff;
    })
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
            this.actionRole.deleteImg = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Hồ sơ bệnh án' && x.dataAccessName === 'Xoá Hình ảnh');
            this.deleteImg = this.actionRole.deleteImg;
          })
      })
  }

  onGetMedicalServiceIndicate = () => {
    this.medicalServiceIndicates = [];
    this.medicalRecordDesignat.medicalServiceIndicates.forEach(val => {
      if (val.isCombo) {
        val.listIndicate.forEach(valCombo => {
          valCombo._id = val._id;
          this.medicalServiceIndicates.push(valCombo);
        });
        return;
      }
      this.medicalServiceIndicates.push(val);

    });
     this.medicalServiceIndicates = this.sortTreatmentProcessByDateTime(this.medicalServiceIndicates);
  }
  sortTreatmentProcessByDateTime = (arrayData: Array<any>) => {
    return arrayData.sort((a, b) => Date.parse(b.createDateTime) - Date.parse(a.createDateTime));
  }
  onMoveRoome = (footerCompoent: ExaminaFooterComponent):void => {
    this.braceDetailComponent.onMoveRoom(this.medicalRecordDesignat, footerCompoent, true)
  }

  onSaveAndRouter = ():void => {

  }

  handleNewTreatment = ():void => {
    let newRow:any = {date: this.columnDef[0]?.value, relize: this.columnDef[1]?.value, note: this.columnDef[2]?.value, doctor: this.columnDef[3]?.value};
    if ( newRow.doctor && newRow.date ) {
      this.treamentData.push(newRow);
      this.treamentData = [...this.treamentData];
      this.columnDef.filter(val => val.value = null)
    }
  }

  onSaveUpdate = ():void => {

  }

  onDeleteRow = (index:number):void => {
    this.treamentData.splice(index, 1)
  }

  getStaffName = (staffId: string): string => {
    return this.staffs.find( staff => staff._id === staffId)?.fullName;
  }

  onSaveDesignat = (index: number):void => {
    const modal:NgbModalRef = this.modal.open(ConfirmModalComponent,{
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Bạn có chắc chắn hoàn thành chỉ định thực hiện này. Vui lòng kiểm tra và cập nhật hình ảnh`;
    modal.result.then(result => {
      if ( !result ) { return}
    })
  }

  addImgs = ():void => {

  }

  onUpdateDesignat = (item, index: number): void => {
    this.store.dispatch(onLoadServiceIndicateById({ id: item.id }));
    const modal: NgbModalRef = this.modal.open(DesignatBlockModalComponent, {
      centered: true,
      size: 'lg',
    });
    modal.componentInstance.medicalRecord = this.medicalRecordDesignat;
    modal.componentInstance.medicalInfo = item;
    modal.result.then(result => {
      if (!result) { return }
      let medicalSIC = { _id: this.medicalRecordDesignat._id, medicalServiceIndicate: result.formData }
      let imgInfo = result.imgInfo;
      if (imgInfo.image.length != 0) {
        let imageData: IndicateImageModel = {
          id: this.medicalRecordDesignat._id,
          imageDatas: imgInfo.image,
          indicateGroupShortName: imgInfo.indicateGroupShortName,
          indicateShortName: imgInfo.indicateShortName,
        }
        this.uploadImgService.onUploadImage(imageData, ScreenImage.examine);
      }
      this.store.dispatch(onMedicalSICommand(medicalSIC))
    }).catch(error => console.log(error))
  }
  onCreateSchedule = (rowData): void => {
    const modalRef = this.modal.open(ScheduleModalComponent, {
      size: 'lg', //'sm' | 'lg' | 'xl' | string;
      backdropClass: 'appointment-backdrop',
      windowClass: 'appointment-window',
      centered: true
    })
    modalRef.componentInstance.medicalRecordData = this.medicalRecordDesignat;
    modalRef.componentInstance.treatmentProcess = rowData;
    modalRef.componentInstance.medicalServiceIndicate = rowData;
    modalRef.result.then(result => {
      if (!result) { return };
      this.store.dispatch(onCreateMedicalSchedule({ medicalSchedule: result, scheduleReport: null }));
    }).catch(error => { return console.log(error) })
  }

  onSaveNote = () => {
    let medicalRecordNote = {
      _id: this.medicalRecordDesignat._id,
      note: this.medicalRecordDesignat.note
    }
    this.store.dispatch(onMedicalRecordNote(medicalRecordNote));
  }

  onBackClick = () => {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.store.dispatch(clearStateMedicalRecord());
  }
}

const TREAMENT_COLDEF: Array<ColumnDef> = [
  {
    label: 'Ngày',
    title: 'date',
    colType: 'date',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
  {
    label: 'Thực hiện và tiến triển',
    title: 'relize',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
  {
    label: 'Ghi chú',
    title: 'note',
    headerStyle: 'text-align: center',
    style: 'text-align: center'
  },
  {
    label: 'Người thực hiện',
    title: 'doctor',
    headerStyle: 'text-align: center',
    style: 'text-align: center',
    colType: 'select',
  },
];

const DESIGNAT_COLDEF: Array<ColumnDef> = [
  {
    label: 'Ngày',
    title: 'createDateTime',
    colType: 'text',
  },
  {
    label: 'Tên chỉ định',
    title: 'name',
    colType: 'text',

  },
  {
    label: 'Người chỉ định',
    title: 'indicater',
    colType: 'text',
  },
  {
    label: 'Người thực hiện',
    title: 'staffId',
    colType: 'text',
  },
  {
    label: 'Trạng thái',
    title: 'status',
    colType: 'text',
  },
];
