import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { showNotify } from 'src/app/store/actions/notify.action';
import { RootState } from 'src/app/store/entities/state.entity';

export enum IMAGE_TYPE {
  PNG = '.png',
  JPG = '.jpg',
  JPEG = '.jpeg',
  SVG = '.svg',
  STL = '.stl',
}

@Component({
  selector: 'app-picture-addition-modal',
  templateUrl: './picture-addition-modal.component.html',
  styleUrls: ['./picture-addition-modal.component.scss']
})
export class PictureAdditonModalComponent implements OnInit {
  @Input() title: string = null;
  imgs: Array<{id: string, isUpload: boolean, imageType: string, imageUrl: string}> = [];
  imgFile: any = [];
  imageType: Array<string> = [];

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<RootState>,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.imageType = Object.values(IMAGE_TYPE).map((item) => item);
  }
  handleCheckImgSize(file :any) {
    const fileInput = file;
    if (fileInput) {
      if (fileInput.size > 1024 * 1024 * 15) { // Kiểm tra nếu kích thước lớn hơn 10MB
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
    this.cdr.markForCheck();
  }
  deleteImage(event) {
    if (!event) return;
    let imgDelete = this.imgs.filter(x => x.imageUrl == event)[0];
    this.imgFile = this.imgFile.filter(val => val.id != imgDelete.id);
    this.imgs = this.imgs.filter(val => val.id != imgDelete.id);
  }

  onSaveModal = (): void => {
    if(this.imgFile.length === 0){
      return this.store.dispatch(showNotify({ notifyType: 'success', message: 'Vui lòng thêm hình ảnh' }));
    }
    else{
      let imgUploadFile = this.imgFile.some(val => val.isUpload == false)
      if (imgUploadFile) {
        return  this.store.dispatch(showNotify({ notifyType: 'error', message: 'Dung lượng hình ảnh quá lớn , Không thể tải ảnh lên' }));
      }
      this.activeModal.close(this.imgFile);
    }
  }

  onGetImageType = (imageName: string) => {
    let imageType: string = null;
    for (const key in IMAGE_TYPE) {
      if (imageName.includes(IMAGE_TYPE[key])) return imageType = IMAGE_TYPE[key];
    }
    return imageType;
  }

}
