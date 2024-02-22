import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NgbModal, NgbModalRef, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ColumnDef from 'src/app/shared/components/at-base-table/at-base-table.component';
import { ExaminaFooterComponent } from 'src/app/shared/components/examine-view/examine-footer/examine-footer.component';
import { PICTURE } from 'src/app/shared/data/examine';
import { RoomList } from 'src/app/shared/enum/share.enum';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadCustomerByCode } from 'src/app/store/actions/customer.action';
import { clearStateMedicalRecord, onExaminationFinish, onLoadMedicalRecordById, onReceiveCustomerToRoom, onTransferRoom } from 'src/app/store/actions/medicalRecord.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Customer from '../../../../../../../at-common/model/Customer';
import GeneralExamination from '../../../../../../../at-common/model/GeneralExamination';
import MedicalImageModel from '../../../../../../../at-common/model/MedicalImageModel';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import * as _ from 'lodash';
import { PatientComponent } from 'src/app/shared/components/examine-view/patient/patient.component';
import MedicalBaseModel from '../../../../../../../at-common/model/MedicalBaseModel';
import { ServiceComponent } from '../../../../shared/components/examine-view/service/service.component';
import { ROOM_STATUS } from '../../../../../../../at-common/model/enum';
import { BracesDetailComponent } from '../../braces/braces-detail/braces-detail.component';
import { ScreenImage } from 'src/app/store/services/uploadImages.service';

@Component({
  selector: 'app-general-detail',
  templateUrl: './general-detail.component.html',
  styleUrls: ['./general-detail.component.scss'],
  providers: [DestroySubsribeService, BracesDetailComponent]
})
export class GeneralDetailComponent implements OnInit {
  @ViewChild(PatientComponent, { static: false }) patientComponent: PatientComponent;
  @ViewChild(ServiceComponent, { static: false }) serviceComponent: ServiceComponent;
  medicalRecordGeneral: MedicalRecord = new MedicalRecord();
  customerInfo: Customer = new Customer();
  active: number = 1;
  deleteImg: boolean;
  screenImage = ScreenImage;
  actionRole: {
    deleteImg: boolean,
  } = {
      deleteImg: false,
    };

  constructor(
    private _formBuilder: FormBuilder,
    public location: Location,
    private router: Router,
    private modal: NgbModal,
    private activeRoute: ActivatedRoute,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private braceDetailComponent: BracesDetailComponent
  ) { }

  ngOnInit(): void {
    this.activeRoute.queryParams.subscribe(param => {
      if ( param && param._id ) {
        this.onLoadMedicalRecord(param._id)
      }
    });
    this.onLoadRoleStaff();
  }

  onChangeTab(event) {
    this.active = event;
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    changeEvent.preventDefault();
    if (!this.onChangeValue(changeEvent.activeId)) return this.onChangeTab(changeEvent.nextId);
    this.onConfirmChangeScreen(changeEvent.activeId, changeEvent.nextId);
  }

  onChangeValue = (currentId: number): boolean => {
    if (currentId == 1) {
      if (!_.isEqual(this.patientComponent.generalExamination, this.patientComponent.generalExaminationOld)) {
        return true;
      }
    }
    if (currentId == 3) {
      return !this.serviceComponent.deactivate.canChange;
    }
    return false;
  }

  onLoadMedicalRecord = (medicalRecordId: string):void => {
    this.store.dispatch(onLoadMedicalRecordById({id: medicalRecordId}));
    this.store.select( state => state.medicalRecord.medicalRecord )
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe( medicalRecord => {
        if ( !medicalRecord ) { return }
        this.medicalRecordGeneral = _.cloneDeep(medicalRecord);
        this.onLoadCustomerByCode();
      }
    )
  }

  onLoadCustomerByCode = ():void => {
    this.store.select( state => state.customer.customerItem)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe(customer => customer && (this.customerInfo = customer))
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

  onMoveRoom = (footerCompoent: ExaminaFooterComponent):void => {
    this.braceDetailComponent.onMoveRoom(this.medicalRecordGeneral, footerCompoent, true);
  }

  onExaminationFinish = () => {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        _id: this.medicalRecordGeneral._id,
      }
    }

    this.activeRoute.queryParams
      .subscribe(param => {
        if (param && param.isUpdate) {
          return this.router.navigate(['/benh-an/chi-tiet/i'], navigationExtras);
        }
        this.router.navigate(['/kham-benh/phong-tong-quat/chi-tiet/_i'], navigationExtras);
        setTimeout(() => {
          this.store.dispatch(onExaminationFinish({ _id: this.medicalRecordGeneral._id }));
        }, 100);
      });
  }

  onConfirmChangeScreen = (currentId: number, tabId: number) => {
    if (currentId == 1) {
      this.patientComponent.onCreateMedicalRecordGeneral();
      this.patientComponent.deactivate.setCanDeactivate(true);
    }
    if (currentId == 3) {
      if (this.serviceComponent.activeId == 1) {
        this.serviceComponent.onSaveDesignat(null);
      }
      if (this.serviceComponent.activeId == 2) {
        this.serviceComponent.onSaveService(4);
      }
      this.serviceComponent.deactivate.setCanDeactivate(true);
    }
    this.onChangeTab(tabId);
  }

  onImplementionCommit = ():void => {

  }

  onBackClick = () => {
    this.location.back();
  }

  ngOnDestroy(): void {
    this.store.dispatch(clearStateMedicalRecord());
  }

}
