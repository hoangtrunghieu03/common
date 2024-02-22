import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { pluck, takeUntil } from 'rxjs/operators';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { ExaminaFooterComponent } from 'src/app/shared/components/examine-view/examine-footer/examine-footer.component';
import { ATContent } from 'src/app/shared/data/at.model';
import { SERVICE_DESIGNATE_COLDEF } from 'src/app/shared/data/examine';
import { formatCurentcy } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onAddTreatmentProcess, onLoadMedicalRecordById, onMedicalRecordNote, onReceiveCustomerToRoom, onTransferRoom } from 'src/app/store/actions/medicalRecord.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import { DesignatBlockModalComponent } from '../../designat/designat-modal/designat-modal.component';
import { MinorsugeryModalComponent } from '../minorsugery-modal/minorsugery-modal.component';
import * as _ from 'lodash';
import Customer from '../../../../../../../at-common/model/Customer';
import { onLoadCustomerByCode } from 'src/app/store/actions/customer.action';
import Staffs from '../../../../../../../at-common/model/Staffs';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import MedicalBaseModel from '../../../../../../../at-common/model/MedicalBaseModel';
import { TreatmentModalComponent } from 'src/app/shared/components/examine-view/treatment/treatment-modal/treatment-modal.component';
import { MinorsurgeryCommitmentComponent } from 'src/app/components/commitment/minorsurgery-commitment/minorsurgery-commitment.component';
import { ROOM_STATUS } from '../../../../../../../at-common/model/enum';
import { RoomList } from 'src/app/shared/enum/share.enum';
import { BracesDetailComponent } from '../../braces/braces-detail/braces-detail.component';
import Role from '../../../../../../../at-common/model/Role';
import { ScreenImage } from 'src/app/store/services/uploadImages.service';

@Component({
  selector: 'app-minorsurgery-detail',
  templateUrl: './minorsurgery-detail.component.html',
  styleUrls: ['./minorsurgery-detail.component.scss'],
  providers: [DestroySubsribeService, BracesDetailComponent]
})
export class MinorsurgeryDetailComponent implements OnInit {

  serviceColdef: Array<ColumnDef> = SERVICE_DESIGNATE_COLDEF;
  designas = DESIGNATS;
  designatCol: ColumnDef[] = DESIGNAT_COLDEF
  serviceFee = SERVICE;
  serviceFeeCol = SERVICE_COL;
  servicePaymentContent: ATContent[]=[];
  medicalMinorsugery: MedicalRecord = new MedicalRecord();
  medicalServiceFee: MedicalBaseModel[] & { price: string | number, staffName: string}[] = [];
  designatblock: MedicalBaseModel[] = [];
  customerInfo: Customer = new Customer();
  staffs: Staffs[] = [];
  deleteImg: boolean;
  screenImage = ScreenImage;
  actionRole: {
    actionTreatment: boolean,
    deleteImg: boolean,
  } = {
      actionTreatment: false,
      deleteImg: false,
    };

  constructor(
    private router: Router,
    private modal: NgbModal,
    public location: Location,
    private activeRout: ActivatedRoute,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private bracesDetailComponent: BracesDetailComponent
  ) {}

  ngOnInit(): void {
    this.onLoadRoleStaff();
    this.activeRout.queryParams
      .pipe(pluck('_id'))
      .subscribe(param => param && this.onLoadMedicalRecordMinorsugery(param));
      this.onLoadRoleStaff();
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
            this.actionRole.deleteImg = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Hồ sơ bệnh án' && x.dataAccessName === 'Xoá Hình ảnh');
            this.deleteImg = this.actionRole.deleteImg;
          })
      })
  }

  onLoadMedicalRecordMinorsugery = (medicalRecordId: string):void => {
    this.store.dispatch(onLoadMedicalRecordById({id: medicalRecordId}));
    this.store.select(state => state.medicalRecord.medicalRecord)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe(medicalRecord => {
      if ( !medicalRecord ) { return }
      this.medicalMinorsugery = _.cloneDeep(medicalRecord);
      this.onLoadStaff();
      this.onLoadCustomerByCode();
    })
  }

  onLoadCustomerByCode = ():void => {
    this.store.select( state => state.customer.customerItem)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe(customer => customer && ( this.customerInfo = customer));
  }

  onLoadStaff = (): void => {
    // this.store.dispatch(loadStaff());
    this.store.select(state => state.staff.staffList)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(staff => {
        if (!staff) { return }
        this.staffs = staff
        this.medicalServiceFee = this.medicalMinorsugery.medicalServices
          ?.concat(this.medicalMinorsugery?.medicalServiceIndicates)
          .map((item) => {
            return { ...item, ...{ price: item.money, staffName: this.getStaffName(item.staffId) } }
          });
        // this.designatblock = this.medicalMinorsugery?.medicalServices?.map((item) => {
        //   return { ...item, ...{ indicater: this.getStaffName(item.indicater) } }
        // })
      })
  }

  onUpdateDesignat = (item, index: number):void => {
    const modal:NgbModalRef = this.modal.open(MinorsugeryModalComponent,{
      centered: true,
      size: 'lg',
      scrollable: true
    });
    modal.componentInstance.medicalRecord = {id: this.medicalMinorsugery._id, medical: item};
    modal.result.then(result => {
      if ( !result ) { return}
    }).
    catch( error => console.log(error))
  }

  onMedicalRecordCommitment = (): void => {
    const modal: NgbModalRef = this.modal.open(MinorsurgeryCommitmentComponent, {
      centered: true,
      size: 'xl',
      windowClass: 'modal-commitment'
    })
    modal.componentInstance.medicalRecord = this.medicalMinorsugery;
    modal.componentInstance.customer = this.customerInfo;
    modal.result.then(result => {
      if (!result) { return }
      
    }).catch(error => {
    })
  }

  onSaveAndRouter = ():void => {

  }

  onMoveRoome = (footerCompoent: ExaminaFooterComponent): void => {
    this.bracesDetailComponent.onMoveRoom(this.medicalMinorsugery, footerCompoent, true);
  }

  handleTreatmentProcess = (): void => {
    const modal: NgbModalRef = this.modal.open(TreatmentModalComponent, {
      centered: true,
      size: 'lg'
    })
    modal.componentInstance.medicalRecordData = this.medicalMinorsugery;
    modal.result.then(result => {
      if (!result) return;
      this.store.dispatch(onAddTreatmentProcess({ _id: this.medicalMinorsugery?._id, treatmentProcess: result }))
    }).catch(error => {
    })
  }

  onSaveNote = () => {
    let medicalRecordNote = {
      _id: this.medicalMinorsugery._id,
      note: this.medicalMinorsugery.note
    }
    this.store.dispatch(onMedicalRecordNote(medicalRecordNote));
  }

  getStaffName = (staffId: string):string => {
    if (!staffId) return '--';
    return this.staffs?.find(val => val._id == staffId)?.fullName;
  }

  onBackClick = () => {
    this.location.back();
  }
}


const DESIGNATS = [
  {name: 'Vệ sinh răng', status: 'Chưa hoàn thành', doctor: 'Nguyễn Văn Linh'},
  {name: 'Nhổ răng', status: 'Chưa hoàn thành', doctor: 'Lê Ngọc Tuấn'}
]
const DESIGNAT_COLDEF: Array<ColumnDef> = [
  {
    label: 'Tên chỉ định',
    title: 'name',
  },
  {
    label: 'Người chỉ định',
    title: 'indicater',
  },
  {
    label: 'Trạng thái',
    title: 'status',
  },
];

const SERVICE = [
  {name: 'Chụp Xquang hàm', serviceFee: 100000},
  {name: 'Làm trắng răng', serviceFee: 100000}
]

const SERVICE_COL: Array<ColumnDef> = [
  {
    label: 'Tên chỉ định',
    title: 'name',
    headerStyle: 'text-align: center',
    style: 'text-align: center',
  },
  {
    label: 'Phí',
    title: 'serviceFee',
    colType: 'money',
    headerStyle: 'text-align: center',
    style: 'text-align: center',
  },
];