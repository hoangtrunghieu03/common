import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import ATAuComplete from 'src/app/shared/components/at-autocomplete/at-autocomplete';
import { hiddenModal } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onMedicalServiceCommand } from 'src/app/store/actions/medicalRecord.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalBaseModel from '../../../../../../../at-common/model/MedicalBaseModel';

@Component({
  selector: 'app-minorsugery-modal',
  templateUrl: './minorsugery-modal.component.html',
  styleUrls: ['./minorsugery-modal.component.scss'],
  providers: [DestroySubsribeService, DatePipe]
})
export class MinorsugeryModalComponent implements OnInit {

  @Input() medicalRecord: {id: string, medical: MedicalBaseModel};
  minorsugeryForm: FormGroup;
  staffs: ATAuComplete[] = [];
  staffLoginId: string = null;

  constructor(
    public activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private cd: ChangeDetectorRef,
    private modal: NgbModal,
    private datePipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.onloadStaff();
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.createForm();
  }

  onloadStaff = ():void => {
    this.store.select(state => state.staff.staffList)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe( staff => staff && (this.staffs = staff.map(item => ({_id: item._id, label: item.fullName, value: item._id}))))
  }

  onLoadStaffLogin = ():void => {
    this.store.select(state => state.authencation._id)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe(staffId => staffId && (this.staffLoginId = staffId))
  }

  createForm = ():void => {
    this.minorsugeryForm = this._formBuilder.group({
      id: [this.medicalRecord?.medical?.id],
      name: [this.medicalRecord?.medical?.name],
      staffId: [this.medicalRecord?.medical?.staffId ? this.medicalRecord.medical.staffId : this.staffLoginId],
      finishDate: [this.medicalRecord?.medical?.finishDate ? this.medicalRecord.medical.finishDate :
        this.datePipe.transform(new Date(), 'd/M/yyyy')],
      executionDate: [this.medicalRecord?.medical?.executionDate ? this.medicalRecord.medical.executionDate :
        this.datePipe.transform(new Date(), 'd/M/yyyy')],
      comment: [this.medicalRecord?.medical?.comment],
      status: [this.medicalRecord?.medical?.status],
      money: [this.medicalRecord?.medical?.money],
      quantity: [this.medicalRecord?.medical?.quantity],
    })
  }

  onSelectDoctor = (param):void => {
    this.minorsugeryForm.get('doctor').setValue(param.label)
  }

  onSaveModal = (action: boolean):void => {
    hiddenModal(true);
    const modal:NgbModalRef = this.modal.open(ConfirmModalComponent,{
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = ` Xác định lưu thông tin chỉ định thực hiện <b>${this.minorsugeryForm.get('name').value}</b>`;
    modal.result.then(result => {
      hiddenModal(false);
      if ( !result ) { return}
      action && this.minorsugeryForm.get('status').setValue('Hoàn thành');
      let medicalResult = {_id: this.medicalRecord.id, medicalService: this.minorsugeryForm.value}
      this.store.dispatch(onMedicalServiceCommand(medicalResult));
      this.activeModal.close();
    }).catch(error => {
      hiddenModal(false);
    })
  }

  onMedicalRecordCommitment = (): void => {
    hiddenModal(true);
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Đồng ý thực hiện <b>phẫu thuật</b>`;
    modal.result.then(result => {
      hiddenModal(false);
      if (!result) { return }
      let navigationExtras: NavigationExtras = {
        queryParams: {
          _id: this.medicalRecord.id,
        }
      }
      const url = this.router.serializeUrl(
        this.router.createUrlTree(['ban-cam-ket/cam-ket-phau-thuat'], navigationExtras)
      );

      window.open(url, '_blank');
    }).catch(error => {
      hiddenModal(false);
    })
  }

}
