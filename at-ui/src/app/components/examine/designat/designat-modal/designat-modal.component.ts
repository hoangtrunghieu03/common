import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { DeliveryNoteComponent } from 'src/app/components/commitment/delivery-note/delivery-note.component';
import { hiddenModal, scrollToFirstInvalidControl, validateAllFormFields } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { OPERATOR_SERVICE_STATUS, TYPE_SERVICEINDICATE } from '../../../../../../../at-common/model/enum';
import MedicalBaseModel from '../../../../../../../at-common/model/MedicalBaseModel';
import MedicalServiceIndicate from '../../../../../../../at-common/model/MedicalServiceIndicate';
import Staffs from '../../../../../../../at-common/model/Staffs';
import ATAuComplete from "../../../../shared/components/at-autocomplete/at-autocomplete";
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import { validateForm, FormatDateComponent } from '../../../../shared/functions/function-helper';
import { IMAGE_TYPE } from 'src/app/shared/components/examine-view/examine-picture/picture-addition-modal/picture-addition-modal.component';
import { showNotify } from 'src/app/store/actions/notify.action';

@Component({
  selector: 'app-designat-modal',
  templateUrl: './designat-modal.component.html',
  styles: [],
  providers: [DestroySubsribeService, DatePipe, FormatDateComponent]
})
export class DesignatBlockModalComponent implements OnInit {

  @Input() medicalRecord: MedicalRecord;
  @Input() medicalInfo: MedicalBaseModel;
  designatForm: FormGroup;
  staffs: ATAuComplete[] = [];
  staffLoginId: string = null;
  imgs: Array<{id: string, isUpload: boolean,imageType: string, imageUrl: string}> = [];
  imgFile: any = [];

  medicalServiceIndicate: MedicalServiceIndicate = new MedicalServiceIndicate();
  imgInfo = { indicateGroupShortName: null, indicateShortName: null, image: [] };

  typeServiceIndicate = TYPE_SERVICEINDICATE;

  validateForm = validateForm;

  constructor(
    public activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder,
    private store: Store<RootState>,
    private destroyService: DestroySubsribeService,
    private cd: ChangeDetectorRef,
    private modal: NgbModal,
    private datePipe: DatePipe,
    private router: Router,
    private formatDate: FormatDateComponent
    ) { }

  ngOnInit(): void {
    this.onloadStaff();
    this.onLoadStaffLogin();
    this.onLoadServiceIndicate();
    this.designatForm = this.createForm();
    this.cd.detectChanges();
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

  onLoadServiceIndicate = (): void => {
    this.store.select(state => state.serviceIndicate.serviceIndicateItem)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(service => service && (this.medicalServiceIndicate = service))
  }

  createForm = ():FormGroup => {
    return this._formBuilder.group({
      _id: [this.medicalInfo?._id], //id của dịch vụ chỉ định
      id: [this.medicalInfo?.id], //id của dịch vụ chỉ định
      name: [this.medicalInfo?.name],
      staffId: [this.medicalInfo?.staffId ? this.medicalInfo.staffId : this.staffLoginId], // id của bác sĩ thực hiện
      comment: [this.medicalInfo?.comment],
      finishDate: [this.medicalInfo?.finishDate ? this.datePipe.transform(this.medicalInfo?.finishDate, 'dd-MM-yyyy') :
        this.datePipe.transform(new Date(), 'dd-MM-yyyy')], //Ngày hoàn thành
      executionDate: [this.medicalInfo?.executionDate ? this.datePipe.transform(this.medicalInfo?.executionDate, 'dd-MM-yyyy') :
        this.datePipe.transform(new Date(), 'dd-MM-yyyy')], // Ngày thực hiện
      sampleSender: [this.medicalInfo?.sampleSender ? this.medicalInfo?.sampleSender : this.staffLoginId], // người gửi mẫu
      sampleReceiver: [this.medicalInfo?.sampleReceiver], // Id người nhận mẫu
      applianceReceiver: [this.medicalInfo?.applianceReceiver ? this.medicalInfo?.applianceReceiver : this.staffLoginId], // Id người nhận khí cụ
      executeOutSide: [this.medicalInfo?.executeOutSide], // thực hiện ngoài,
      status: [this.medicalInfo?.status ? this.medicalInfo?.status : 'Chưa hoàn thành'],
      isCombo: [this.medicalInfo?.isCombo],
    })
  }

  onCheckValidForm = (action: boolean) => {
    if (this.designatForm.valid) {
      this.onSaveModal(action);
    } else {
      validateAllFormFields(this.designatForm);
      scrollToFirstInvalidControl(this.designatForm);
    }
  }

  onSaveModal = (action: boolean):void => {
    hiddenModal(true);
    const modal:NgbModalRef = this.modal.open(ConfirmModalComponent,{
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = ` Xác định lưu thông tin chỉ định thực hiện <b>${this.designatForm.get('name').value}</b>`;
    modal.result.then(result => {
      hiddenModal(false);
      if ( !result ) { return}
      let executionDate = new Date(this.designatForm.get('executionDate').value);
      let finishDate = new Date(this.designatForm.get('finishDate').value);
      if (finishDate < executionDate) {
        this.store.dispatch(showNotify({ notifyType: 'success', message: 'Ngày thực hiện và ngày hoàn thành không hợp lệ' }));
      }else {
        let imgUploadFile = this.imgFile.some(val => val.isUpload == false)
        if (imgUploadFile) {
          return  this.store.dispatch(showNotify({ notifyType: 'error', message: 'Dung lượng hình ảnh quá lớn , Không thể tải ảnh lên' }));
        }
        this.designatForm.get('executionDate').setValue(this.formatDate.formatDate(this.designatForm.get('executionDate').value, 'yyyy-MM-dd'));
        this.designatForm.get('finishDate').setValue(this.formatDate.formatDate(this.designatForm.get('finishDate').value, 'yyyy-MM-dd'));
        action && this.designatForm.get('status').setValue(OPERATOR_SERVICE_STATUS.FINISH);
        // !action && this.designatForm.get('finishDate').setValue(this.medicalInfo?.finishDate);
        this.imgInfo.image = this.imgFile;
        this.imgInfo.indicateGroupShortName = this.medicalServiceIndicate.medicalServiceIndicateGroupShortName;
        this.imgInfo.indicateShortName = this.medicalServiceIndicate.shortName;
        this.activeModal.close({formData: this.designatForm.value, imgInfo: this.imgInfo});
      }
    }).catch(error => {
      hiddenModal(false);
    })
  }

  onSelectDoctor = (param):void => {
    this.designatForm.get('doctor').setValue(param.label)
  }
  handleCheckImgSize(file :any) {
    const fileInput = file;
    if (fileInput) {
      if (fileInput.size > 1024 * 1024 * 15) {  // Kiểm tra nếu kích thước lớn hơn 10MB
        this.store.dispatch(showNotify({ notifyType: 'error', message: 'Dung lượng hình ảnh quá lớn' }));
        return true;
      }
      return false;
    }
  }
  handleAddImg = (event): void => {
    if (!(event.target.files && event.target.files.length != 0)) return;
    for (let index = 0; index < event.target.files.length; index++) {
      let fileIndex = event.target.files[index];
      let isCheckFileSize = this.handleCheckImgSize(fileIndex);
      let idFile = (Math.random() + 1).toString(36).substring(7);
      fileIndex.id = idFile;
      if (isCheckFileSize) {
        fileIndex.isUpload = !isCheckFileSize;
      }
      this.imgFile.push(fileIndex);
      let reader = new FileReader(); // HTML5 FileReader API
      reader.readAsDataURL(fileIndex);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.imgs.push({id: idFile,isUpload: !isCheckFileSize ,imageType: this.onGetImageType(fileIndex.name), imageUrl: String(reader.result) });
      }
    }
    // ChangeDetectorRef since file is loading outside the zone
    this.cd.markForCheck();
  }

  deleteImage(event) {
    if (!event) return;
    let imgDelete = this.imgs.filter(x => x.imageUrl == event)[0];
    this.imgFile = this.imgFile.filter(val => val.id != imgDelete.id);
    this.imgs = this.imgs.filter(val => val.id != imgDelete.id);
  }

  onGetImageType = (imageName: string) => {
    let imageType: string = null;
    for (const key in IMAGE_TYPE) {
      if (imageName.includes(IMAGE_TYPE[key])) return imageType = IMAGE_TYPE[key];
    }
    return imageType;
  }

}
