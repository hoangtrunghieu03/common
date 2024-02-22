import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import domtoimage from 'dom-to-image';
import { formatCurentcy } from 'src/app/shared/functions/function-helper';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { showNotify } from 'src/app/store/actions/notify.action';
import { hiddenProgress, showProgress } from 'src/app/store/actions/progress.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { CommitmentImageModel, ScreenImage, UploadImageService } from 'src/app/store/services/uploadImages.service';
import Customer from '../../../../../../at-common/model/Customer';
import MedicalRecord from '../../../../../../at-common/model/MedicalRecord';

@Component({
  selector: 'app-braces-commitment',
  templateUrl: './braces-commitment.component.html',
  styleUrls: ['./braces-commitment.component.scss'],
  providers: [DestroySubsribeService]
})
export class BracesCommitmentComponent implements OnInit {
  @Input() medicalRecord: MedicalRecord;
  @Input() customer: Customer;
  @ViewChild('htmlData') htmlData: ElementRef;
  bracesForm: FormGroup;

  constructor(
    private uploadImgService: UploadImageService,
    private _formBuilder: FormBuilder,
    public activeModal: NgbActiveModal,
    public store: Store<RootState>
  ) { }

  ngOnInit(): void {
    this.bracesForm = this.createBracesForm();
  }

  createBracesForm = (): FormGroup => {
    return this._formBuilder.group({
      fullName: [this.customer?.fullName],
      address: [this.customer?.address],
      tel: [this.customer?.tel],
      shs: [this.medicalRecord?.medicalRecordCode],
      // id: [null],
      moneyPayment: [formatCurentcy(this.medicalRecord?.payment?.moneyPayment)],
      moneyPaymented: [formatCurentcy(this.medicalRecord?.payment?.moneyPaymented)],
    })
  }

  saveImage = (): void => {
    this.store.dispatch(showProgress());
    let DATA: any = document.getElementById('htmlData')
    domtoimage.toPng(DATA)
      .then((dataUrl) => {
        let imageData: CommitmentImageModel = {
          id: this.medicalRecord._id,
          imageDatas: [dataUrl],
          type: 'cam-ket-nieng-rang',
        }
        this.uploadImgService.uploadCommitment(imageData, ScreenImage.examine);
        this.activeModal.close();
      }).catch((error) => {
        this.store.dispatch(showNotify({ notifyType: 'success', message: 'Tải ảnh không thành công!' }));
        this.store.dispatch(hiddenProgress());
      });
  }
}
