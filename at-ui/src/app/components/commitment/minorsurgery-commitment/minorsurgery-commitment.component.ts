import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import domtoimage from 'dom-to-image';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { showNotify } from 'src/app/store/actions/notify.action';
import { hiddenProgress, showProgress } from 'src/app/store/actions/progress.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { CommitmentImageModel, ScreenImage, UploadImageService } from 'src/app/store/services/uploadImages.service';
import Customer from '../../../../../../at-common/model/Customer';
import MedicalRecord from '../../../../../../at-common/model/MedicalRecord';

@Component({
  selector: 'app-minorsurgery-commitment',
  templateUrl: './minorsurgery-commitment.component.html',
  styleUrls: ['./minorsurgery-commitment.component.scss'],
  providers: [DatePipe, DestroySubsribeService]
})
export class MinorsurgeryCommitmentComponent implements OnInit {
  @Input() medicalRecord: MedicalRecord;
  @Input() customer: Customer;
  minorsurgeryForm: FormGroup;
  agree: boolean = false;

  constructor(
    private uploadImgService: UploadImageService,
    private _formBuilder: FormBuilder,
    private datePipe: DatePipe,
    public activeModal: NgbActiveModal,
    private store: Store<RootState>
  ) { }

  ngOnInit(): void {
    this.minorsurgeryForm = this.createMinorsurgeryForm();
  }

  createMinorsurgeryForm = (): FormGroup => {
    return this._formBuilder.group({
      fullName: [this.customer?.fullName],
      address: [this.customer?.address],
      birthday: [this.datePipe.transform(this.customer?.birthday, 'dd/MM/yyyy')],
      sex: [this.customer?.sex],
      tel: [this.customer?.tel],
      representative: [this.customer?.fullName],
    })
  }

  saveImage = (): void => {
    this.store.dispatch(showProgress());
    let DATA: any = document.getElementById('htmlData');
    domtoimage.toPng(DATA)
      .then((dataUrl) =>  {
        let imageData: CommitmentImageModel = {
          id: this.medicalRecord._id,
          imageDatas: [dataUrl],
          type: 'cam-ket-phau-thuat',
        }
        this.uploadImgService.uploadCommitment(imageData, ScreenImage.examine);
        this.activeModal.close();
      }).catch((error) => {
        this.store.dispatch(showNotify({ notifyType: 'success', message: 'Tải ảnh không thành công!' }));
        this.store.dispatch(hiddenProgress());
      });
  }

}
