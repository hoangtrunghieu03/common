import { Injectable } from '@angular/core';
import { RootState } from '../entities/state.entity';
import { Store } from '@ngrx/store';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import { showProgress } from '../actions/progress.action';
import ZaloInfoManager from '../../../../../at-common/model/manager/ZaloInfoManager';
import ZaloInfo from '../../../../../at-common/model/ZaloInfo';

@Injectable()
export class ZaloService {

  constructor(
    private store: Store<RootState>
  ){}

  async onLoadZaloCurrent(): Promise<HttpStatus<any>> {
    this.store.dispatch(showProgress());
    const zaloManager = new ZaloInfoManager(null);
    zaloManager.classInfo.endPoint = zaloManager.classInfo.endPoint.concat('/getZaloInfoCurrent');
    return zaloManager.search(null);
  }
  async onAuthZalo(zaloAuth): Promise<HttpStatus<ZaloInfo[]>> {
    this.store.dispatch(showProgress());
    const zaloManager = new ZaloInfoManager(null);
    zaloManager.classInfo.endPoint = zaloManager.classInfo.endPoint.concat('/authZalo');
    return zaloManager.search(zaloAuth);
  }
  async onUpdateZalo(zalo): Promise<HttpStatus<ZaloInfo>> {
    this.store.dispatch(showProgress());
    const zaloManager = new ZaloInfoManager(null);
    return zaloManager.update({ _id: zalo._id }, zalo);
  }


}
