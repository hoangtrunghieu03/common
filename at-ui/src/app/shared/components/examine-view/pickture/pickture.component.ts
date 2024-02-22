import { ChangeDetectorRef, Component, Input, OnInit, Output,EventEmitter, SimpleChanges } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ImageInfor } from 'src/app/shared/data/at.model';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { PreviewImgModalComponent } from 'src/app/shared/modal/preview-img-modal/preview-img-modal.component';
import { CommitmentImageModel, IndicateImageModel, UploadImageService } from 'src/app/store/services/uploadImages.service';
import { IMG_TYPE, TYPE_SERVICEINDICATE } from '../../../../../../../at-common/model/enum';
import MedicalImageModel from '../../../../../../../at-common/model/MedicalImageModel';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import * as _ from 'lodash';
import MedicalBaseModel from '../../../../../../../at-common/model/MedicalBaseModel';
import { Store } from '@ngrx/store';
import { RootState } from 'src/app/store/entities/state.entity';
import { onMedicalRecordImages } from 'src/app/store/actions/medicalRecord.action';
import { PictureAdditonModalComponent } from '../examine-picture/picture-addition-modal/picture-addition-modal.component';
import { takeUntil } from 'rxjs/operators';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';

export enum TYPE_UPLOAD {
  commitment = 'Bản cam kết',
  indicate = 'Chỉ định'
}

@Component({
  selector: 'at-pickture',
  templateUrl: './pickture.component.html',
  styleUrls: ['./pickture.component.scss']
})
export class PicktureComponent implements OnInit {

  @Input() _footerAction: boolean;
  @Input() _newImg: boolean;
  @Input() picktureContent: Picture[];
  @Output() _onSaveImg: EventEmitter<{img: string | ArrayBuffer, blockIndex: number, imgIndex: number}> = new EventEmitter();
  @Input() medicalRecord: MedicalRecord = null;
  @Input() pictureAction: { delete?: boolean, download?: boolean } = { delete: false, download: true };
  @Input() date: string = null;
  @Input() screenImage: string = null;

  fileToUpload: File | null = null;
  img: string | ArrayBuffer= null;
  medicalRecordCommitment: Array<any> = [];
  medicalRecordDeliveryNotes: Array<any> = [];
  imageType = IMG_TYPE;
  folderImage: Array<any> = [];

  typeUpload = TYPE_UPLOAD;

  constructor(
    private modal: NgbModal,
    private _cd: ChangeDetectorRef,
    private uploadImgService: UploadImageService,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService
  ) { }

  ngOnInit(): void {
    this.onLoadRoleStaff();
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
            this.pictureAction.delete = role.dataAccesses?.concat(staff.dataAccessNameExtends)?.some(x => x.group === 'Hồ sơ bệnh án' && x.dataAccessName === 'Xoá Hình ảnh');
          })
      })
  }

  getFolderImage = () => {
    let serviceIndicates: MedicalBaseModel[] = [];
    this.folderImage = _.cloneDeep(this.medicalRecord?.images ? this.medicalRecord?.images : []);
    this.medicalRecord.medicalServiceIndicates.forEach(val => {
      if (val.isCombo) {
        val.listIndicate.forEach(valCombo => {
          valCombo.typeIndicate == TYPE_SERVICEINDICATE.CAPTUREIMAGE && serviceIndicates.push(valCombo);
        });
        return;
      }
      val.typeIndicate == TYPE_SERVICEINDICATE.CAPTUREIMAGE && serviceIndicates.push(val);
    });

    this.folderImage.forEach(val => {
      val?.medicalServiceIndicates.filter(x => (x.haveUpdate = true) && (x.isUpdate = false));
    });

    serviceIndicates.forEach(indicate => {
      let index = this.folderImage?.findIndex(x => x.indicateGroupShortName == indicate.groupIndicateShortName);
      if (index == -1) {
        return this.folderImage.push({
          indicateGroupName: indicate.groupIndicateName,
          indicateGroupShortName: indicate.groupIndicateShortName,
          medicalServiceIndicates: [
            {
              imgUrl: [],
              indicateName: indicate.name,
              indicateShortName: indicate.indicateShortName
            }
          ]
        });
      }
      if (this.folderImage[index].medicalServiceIndicates.findIndex(x => x.indicateShortName == indicate.indicateShortName) == -1) {
        this.folderImage[index].medicalServiceIndicates.push(
          {
            imgUrl: [],
            indicateName: indicate.name,
            indicateShortName: indicate.indicateShortName
          }
        )
      }
    });
  }

  getImageCommitment = () => {
    let arrayImages = [];
    if (this.medicalRecord.medicalRecordCommitment?.commitmentBaraces) {
      arrayImages = arrayImages.concat(this.medicalRecord?.medicalRecordCommitment?.commitmentBaraces);
    }
    if (this.medicalRecord.medicalRecordCommitment?.commitmentSurgery) {
      arrayImages = arrayImages.concat(this.medicalRecord?.medicalRecordCommitment?.commitmentSurgery);
    }
    this.medicalRecordCommitment = arrayImages;
  }

  getImageDeliveryNotes = () => {
    if (!this.medicalRecord?.deliveryNoteImage) return this.medicalRecordDeliveryNotes = [];
    let arrayImages = [];
    if (this.medicalRecord?.deliveryNoteImage?.deliveryNotesImage) {
      arrayImages = arrayImages.concat(this.medicalRecord?.deliveryNoteImage.deliveryNotesImage);
    }
    if (this.medicalRecord?.deliveryNoteImage?.receiptImage) {
      arrayImages = arrayImages.concat(this.medicalRecord?.deliveryNoteImage.receiptImage);
    }
    this.medicalRecordDeliveryNotes = [...arrayImages];
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.getImageCommitment();
    this.getImageDeliveryNotes();
    this.getFolderImage();
  }

  handleAddImg = (event, indexData: number):void => {
    if (!(event.target.files && event.target.files.length != 0)) return;
    let imgs: any = [];
    for (let index = 0; index < event.target.files.length; index++) {
      let reader = new FileReader(); // HTML5 FileReader API
      reader.readAsDataURL(event.target.files[index]);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        imgs.push({img: String(reader.result), blockIndex: indexData, imgIndex: null})
      }
    }
    this._onSaveImg.emit(imgs);
    // ChangeDetectorRef since file is loading outside the zone
    this._cd.markForCheck();
  }

  onAddImage = (title, indicateGroupShortName, indicateShortName, typeUpload) => {
    const modal: NgbModalRef = this.modal.open(PictureAdditonModalComponent, {
      centered: true,
      size: 'lg'
    })
    modal.componentInstance.title = title;
    modal.result.then(result => {
      if (!result) { return }
      if (typeUpload == TYPE_UPLOAD.indicate) {
        let imageData: IndicateImageModel = {
          id: this.medicalRecord._id,
          imageDatas: result,
          indicateGroupShortName: indicateGroupShortName,
          indicateShortName: indicateShortName,
        }
        this.uploadImgService.onUploadImage(imageData, this.screenImage, this.date);
      } else {
        let imageData: CommitmentImageModel = {
          id: this.medicalRecord._id,
          imageDatas: result,
          type: 'cam-ket-phau-thuat',
        }
        this.uploadImgService.uploadCommitment(imageData, this.screenImage, this.date);
      }
    }).catch(error => {
    })
  }

  viewDetail = ( img:string ):void => {
    const modal = this.modal.open(PreviewImgModalComponent, {
      centered: true,
      windowClass: 'product-preview-img'
    });
    modal.componentInstance.img = img;
  }

  deleteImage = (event, type): void => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = ` Xác nhận xóa hình ảnh`;
    modal.result.then(result => {
      if (!result) { return }
      let imageInfor: ImageInfor = {
        _id: this.medicalRecord._id,
        typeImg: type,
        url: event,
      }
      this.uploadImgService.deleteImage(imageInfor, this.screenImage, this.date);
    }).catch(error => {
    })
  }

  onSaveUpdate = (indicateGroupName, groupIndex, indicateIndex) => {
    let images = _.cloneDeep(this.medicalRecord?.images ? this.medicalRecord?.images : []);
    let indicateName: any = document.getElementById(indicateGroupName + groupIndex + indicateIndex);

    images[groupIndex].medicalServiceIndicates[indicateIndex].indicateName = indicateName.value;
    this.store.dispatch(onMedicalRecordImages({ _id: this.medicalRecord._id, images: images, date: this.date }));
    
    this.folderImage[groupIndex].medicalServiceIndicates[indicateIndex].isUpdate = false;
  }

}

export default interface Picture {
  lable: string
  pictures: string[]
}
