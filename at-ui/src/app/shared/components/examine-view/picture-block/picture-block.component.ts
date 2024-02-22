import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PreviewImgModalComponent } from 'src/app/shared/modal/preview-img-modal/preview-img-modal.component';
import { IMAGE_TYPE } from '../examine-picture/picture-addition-modal/picture-addition-modal.component';
import { saveAs} from 'file-saver';
import { ATConfigOptions, UrlImage } from 'src/ATConfigOptions';

@Component({
  selector: 'at-picture-block',
  templateUrl: './picture-block.component.html',
  styleUrls: ['./picture-block.component.scss']
})
export class PictureBlockComponent implements OnInit {
  UrlImage = UrlImage;
  @Input() _imgData: Array<any>;
  @Input() isAddPicture: boolean = false;;
  @Input() pictureAction: { delete?: boolean, download?: boolean } = { delete: false, download: false };
  @Input() index: number;
  @Output() _onDeleteImg: EventEmitter<any> = new EventEmitter();

  imageType = IMAGE_TYPE;

  constructor(
    private modal: NgbModal) { }

  ngOnInit(): void {
  }

  viewDetail = ( img:string ):void => {
    const modal = this.modal.open(PreviewImgModalComponent, {
      centered: true,
      windowClass: 'product-preview-img'
    });
    modal.componentInstance.img = img;
    modal.componentInstance.pictureAction = this.pictureAction;
    modal.result.then(result => {
      if (!result) return;
      if (result == 'delete') this.deleteImg(img);
      if (result == 'download') this.downloadImage(img);
    }).catch(error => {
    })
  }

  deleteImg = (img):void => {
    // this._onDeleteImg.emit(img);
    if (this.isAddPicture) {
      this._onDeleteImg.emit(img);
    } else {
      var index = img.indexOf(ATConfigOptions.shared_configuration.AMAZON_S3_UPLOAD_FOLDER);
      // Cắt bỏ phần đầu của URL và chỉ lấy phần sau "ant/dev"
      var remainingUrl = img.substring(index + ATConfigOptions.shared_configuration.AMAZON_S3_UPLOAD_FOLDER.length + 1);
      this._onDeleteImg.emit(remainingUrl);
    }
  }

  onNavigateNewTab = (url: string) => {
    window.open(url, "_blank");
  }

  downloadImage(img){
    saveAs(img, img+"");
  }

}
