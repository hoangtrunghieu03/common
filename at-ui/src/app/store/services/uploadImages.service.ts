import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { ImageInfor } from 'src/app/shared/data/at.model';
import MedicalRecord from '../../../../../at-common/model/MedicalRecord';
import { default as AppConfig, default as AppConfiguration } from '../../../../../at-common/utilities/AppConfig';
import { onLoadMedicalRecordByDate, onLoadMedicalRecordById, onLoadMedicalRecordByIdSuccess, onLoadMedicalRecordDetailByIdSuccess } from '../actions/medicalRecord.action';
import { showNotify } from '../actions/notify.action';
import { hiddenProgress, showProgress } from '../actions/progress.action';
import { RootState } from '../entities/state.entity';
import { IMAGE_TYPE } from '../../shared/components/examine-view/examine-picture/picture-addition-modal/picture-addition-modal.component';

export class IndicateImageModel {
  imageDatas: Array<any>
  id: string
  indicateGroupShortName: string
  indicateShortName: String
}
export class CommitmentImageModel {
  imageDatas: Array<any>
  id: string
  type: string
}

export enum ScreenImage {
  examine = "Khám bệnh",
  medical_record = "Hồ sơ bệnh án",
  medical_record_date = "Hồ sơ bệnh án theo ngày",
}
@Injectable()
export class UploadImageService {

  constructor(
    private http: HttpClient,
    private store: Store<RootState>
  ) { }

  /**
   * Upload file throug API
   * @param imageDatas: Array {dataUrl: any, fileName: string, fileType: string}
   */
  public onUploadImage(indicate: IndicateImageModel, screen: string, date?: string) {
    this.store.dispatch(showProgress());
    let formData: FormData = new FormData();
    indicate.imageDatas.forEach((imageData: any) => {
      formData.append('images', imageData, Date.parse(String(new Date())) + imageData.name);
    });

    const uri: string = AppConfig.GetConfiguration(AppConfiguration.REST_API_HOST) + '/upload' + `/${indicate.id}` + `/${indicate.indicateGroupShortName}` + `/${indicate.indicateShortName}`;
    const headers = {
      'Authorization': "Bearer " + localStorage.getItem('id_token'),
      'My-Custom-Header': 'foobar',
      'accesstoken': localStorage.getItem('id_token')
    };

    this.onReloadData(this.http.post<MedicalRecord>(uri, formData, { headers }), indicate.id, screen, date);
  }

  public uploadCommitment(commitment: CommitmentImageModel, screen: string, date?: string) {
    let formData: FormData = new FormData();
    commitment.imageDatas.forEach((imageData: any) => {
      if (imageData instanceof File) {
        formData.append('images', imageData, Date.parse(String(new Date())) + imageData.name);
      } else {
        let blobFile = this.createBlobFromBase64(imageData);
        formData.append('images', blobFile, Date.parse(String(new Date())) + IMAGE_TYPE.PNG);
      }
    });

    const uri: string = AppConfig.GetConfiguration(AppConfiguration.REST_API_HOST) + '/upload/commitment' + `/${commitment.id}` + `/${commitment.type}`;
    const headers = {
      'Authorization': "Bearer " + localStorage.getItem('id_token'),
      'My-Custom-Header': 'foobar',
      'accesstoken': localStorage.getItem('id_token')
    };
    this.onReloadData(this.http.post<MedicalRecord>(uri, formData, { headers }), commitment.id, screen, date);
  }

  onReloadData(data: Observable<MedicalRecord>, medicalRecordId, screen, date) {
    data.subscribe({
      next: (data: MedicalRecord) => {
        switch (screen) {
          case ScreenImage.examine:
            this.store.dispatch(onLoadMedicalRecordByIdSuccess(data));
            break;
          case ScreenImage.medical_record:
            this.store.dispatch(onLoadMedicalRecordDetailByIdSuccess(data));
            break;
          case ScreenImage.medical_record_date:
            this.store.dispatch(onLoadMedicalRecordByDate({ id: medicalRecordId, examinationDate: date }));
            break;
          default:
            break;
        }
        this.store.dispatch(showNotify({
          notifyType: 'success', message: 'Tải hình ảnh thành công'
        })),
          this.store.dispatch(hiddenProgress())
      },
      error: (error: HttpErrorResponse) => {
        of(showNotify({
          notifyType: 'error',
          message: error.message
        }), hiddenProgress()
        )
      }
    });
  }

  public uploadFileDehiscent(imageDatas: Array<any>, id: string) {
    this.store.dispatch(showProgress());
    let formData: FormData = new FormData();
    imageDatas.forEach((imageData: any) => {
      formData.append('images', imageData, Date.parse(String(new Date())) + imageData.name);
    });

    const uri: string = AppConfig.GetConfiguration(AppConfiguration.REST_API_HOST) + '/upload/personalInfomation' + `/${id}`;
    const headers = {
      'Authorization': "Bearer " + localStorage.getItem('id_token'),
      'My-Custom-Header': 'foobar',
      'accesstoken': localStorage.getItem('id_token')
    };

    this.http.post<MedicalRecord>(uri, formData, { headers }).subscribe({
      next: (data: MedicalRecord) => {
        this.store.dispatch(onLoadMedicalRecordByIdSuccess(data));
        this.store.dispatch(showNotify({
          notifyType: 'success', message: 'Tải bản tự khai thành công'
        })),
          this.store.dispatch(hiddenProgress())
      },
      error: (error: HttpErrorResponse) => {
        of(showNotify({
          notifyType: 'error',
          message: error.message
        }), hiddenProgress()
        )
      }
    });
  }

  public deleteImage(imageInfor: ImageInfor, screen, date) {
    this.store.dispatch(showProgress());
    const uri: string = AppConfig.GetConfiguration(AppConfiguration.REST_API_HOST) + '/upload/';
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': "Bearer " + localStorage.getItem('id_token'),
        'My-Custom-Header': 'foobar',
        'accesstoken': localStorage.getItem('id_token')
      }),
      body: imageInfor
    };

    this.http.delete(uri, httpOptions).subscribe({
      next: (data: MedicalRecord) => {
        switch (screen) {
          case ScreenImage.examine:
            this.store.dispatch(onLoadMedicalRecordByIdSuccess(data));
            break;
          case ScreenImage.medical_record:
            this.store.dispatch(onLoadMedicalRecordDetailByIdSuccess(data));
            break;
          case ScreenImage.medical_record_date:
            this.store.dispatch(onLoadMedicalRecordByDate({ id: imageInfor._id, examinationDate: date }));
            break;
          default:
            break;
        }
        this.store.dispatch(showNotify({
          notifyType: 'success', message: 'Xóa hình ảnh thành công'
        })),
          this.store.dispatch(hiddenProgress())
      },
      error: (error: HttpErrorResponse) => {
        of(showNotify({
          notifyType: 'error',
          message: error.message
        }), hiddenProgress()
        )
      }
    });
  }

  createBlobFromBase64 = (base64Data) => {
    var byteString = atob(base64Data.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/png' });
  }
}