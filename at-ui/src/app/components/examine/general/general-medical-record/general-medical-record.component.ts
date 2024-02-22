import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { ExaminaFooterComponent } from 'src/app/shared/components/examine-view/examine-footer/examine-footer.component';
import { TreatmentModalComponent } from 'src/app/shared/components/examine-view/treatment/treatment-modal/treatment-modal.component';
import { RoomList } from 'src/app/shared/enum/share.enum';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onAddTreatmentProcess, onLoadMedicalRecordById, onMedicalRecordNote } from 'src/app/store/actions/medicalRecord.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Customer from '../../../../../../../at-common/model/Customer';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import Role from '../../../../../../../at-common/model/Role';
import { BracesDetailComponent } from '../../braces/braces-detail/braces-detail.component';

@Component({
  selector: 'app-general-medical-record',
  templateUrl: './general-medical-record.component.html',
  styleUrls: ['./general-medical-record.component.scss'],
  providers: [BracesDetailComponent],
})
export class GeneralMedicalRecordComponent implements OnInit {
  medicalRecordData: MedicalRecord = new MedicalRecord();
  customer: Customer = new Customer();

  roomList = RoomList;

  actionRole: {
    continueCheck: boolean,
    actionTreatment: boolean
  } = {
    continueCheck: false,
    actionTreatment: false
  };

  constructor(
    public location: Location,
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private activeRout: ActivatedRoute,
    private modal: NgbModal,
    private braceDetailComponent: BracesDetailComponent
  ) { }

  ngOnInit(): void {
    this.onLoadRoleStaff();
    this.activeRout.queryParams
      .subscribe((param) => {
        if (param) {
          this.onLoadMedicalRecordDetail(param._id)
        }
      });
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
            this.actionRole.continueCheck = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Khám bệnh' && x.dataAccessName === 'Đợi thực hiện - Tiếp tục khám');
            this.actionRole.actionTreatment = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Khám bệnh' && x.dataAccessName === 'Thao tác quá trình điều trị');
          })
      })
  }

  onLoadMedicalRecordDetail = (medicalId: string): void => {
    this.store.dispatch(onLoadMedicalRecordById({ id: medicalId }));
    this.store
      .select((state) => state.medicalRecord.medicalRecord)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((medical) => {
        if (!medical) { return; }
        this.medicalRecordData = _.cloneDeep(medical);
        this.onLoadCustomer();
      });
  };

  onLoadCustomer = (): void => {
    this.store
      .select((state) => state.customer.customerItem)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((customer) => customer && (this.customer = customer));
  };

  onMoveRoome = (footerCompoent: ExaminaFooterComponent): void => {
    this.braceDetailComponent.onMoveRoom(this.medicalRecordData, footerCompoent, true);
  }

  handleTreatmentProcess = (): void => {
    const modal: NgbModalRef = this.modal.open(TreatmentModalComponent, {
      centered: true,
      size: 'lg'
    })
    modal.componentInstance.medicalRecordData = this.medicalRecordData;
    modal.result.then(result => {
      if (!result) return;
      this.store.dispatch(onAddTreatmentProcess({ _id: this.medicalRecordData?._id, treatmentProcess: result }))
    }).catch(error => {
    })
  }

  onSaveNote = () => {
    let medicalRecordNote = {
      _id: this.medicalRecordData._id,
      note: this.medicalRecordData.note
    }
    this.store.dispatch(onMedicalRecordNote(medicalRecordNote));
  }

  onBackClick = () => {
    this.location.back();
  }
}
