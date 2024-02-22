import { Component, Input, OnInit } from '@angular/core';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadImageService } from 'src/app/store/services/uploadImages.service';
import { PictureAdditonModalComponent } from '../picture-addition-modal/picture-addition-modal.component';
import MedicalRecord from '../../../../../../../../at-common/model/MedicalRecord';
import { TYPE_UPLOAD } from '../../pickture/pickture.component';

@Component({
  selector: 'at-picture-addition',
  templateUrl: './picture-addition.component.html',
  styleUrls: ['./picture-addition.component.scss']
})
export class PictureAdditionComponent implements OnInit {

  @Input() medicalRecord: MedicalRecord;
  @Input() indicateGroupShortName: string;
  @Input() indicateShortName: string;
  @Input() indicateName: string;
  @Input() typeUpload: string;

  constructor(
    private uploadImgService: UploadImageService,
    private modal: NgbModal,
  ) { }

  ngOnInit(): void {
  }

  onAddImage = () => {
    const modal: NgbModalRef = this.modal.open(PictureAdditonModalComponent, {
      centered: true,
      size: 'lg'
    })
    modal.componentInstance.title = this.indicateName;
    modal.result.then(result => {
      if (!result) { return }
      // if (this.typeUpload == TYPE_UPLOAD.indicate) {
      //   this.uploadImgService.uploadFile(result, this.medicalRecord._id, this.indicateGroupShortName, this.indicateShortName);
      // } else {
      //   this.uploadImgService.uploadCommitment(result, this.medicalRecord._id, 'cam-ket-phau-thuat');
      // }
    }).catch(error => {
    })
  }

}
