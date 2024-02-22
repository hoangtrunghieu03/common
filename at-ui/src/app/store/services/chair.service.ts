import { Injectable } from '@angular/core';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import Chair from '../../../../../at-common/model/Chair';
import ChairManager from '../../../../../at-common/model/manager/ChairManager';
import { Store } from '@ngrx/store';
import { RootState } from '../entities/state.entity';
import { showProgress } from '../actions/progress.action';

@Injectable()
export class ChairService {

  constructor(
    private store: Store<RootState>
  ) {
  }

  async onLoadChair(): Promise<HttpStatus<Chair[]>> {
    this.store.dispatch(showProgress());
    const chairManager = new ChairManager(null);
    return chairManager.search(null);
  }

  async onLoadChairById(chair: Chair): Promise<HttpStatus<Chair>> {
    this.store.dispatch(showProgress());
    const chairManager = new ChairManager(null);
    let id = chair._id
    return chairManager.get(id);
  }

  async onLoadChairByStaff(): Promise<HttpStatus<Chair>> {
    this.store.dispatch(showProgress());
    const chairManager = new ChairManager(null);
    chairManager.classInfo.endPoint = chairManager.classInfo.endPoint.concat('/chairByStaff');
    return chairManager.get('');
  }

  async onCreateChair(chair: Chair): Promise<HttpStatus<Chair>> {
    this.store.dispatch(showProgress());
    const chairManager = new ChairManager(null);
    return chairManager.insert(chair);
  }

  async onUpdateChair(chair: Chair): Promise<HttpStatus<Chair>> {
    this.store.dispatch(showProgress());
    const chairManager = new ChairManager(null);
    return chairManager.update({ _id: chair._id }, chair);
  }

  async onRemoveChair(chair: Chair): Promise<HttpStatus<boolean>> {
    this.store.dispatch(showProgress());
    const chairManager = new ChairManager(null);
    let id = chair._id
    return chairManager.delete(chair);
  }

  async onResetChair(chair: Chair): Promise<HttpStatus<Chair>> {
    this.store.dispatch(showProgress());
    const chairManager = new ChairManager(null);
    chairManager.classInfo.endPoint = chairManager.classInfo.endPoint.concat('/resetChair');
    return chairManager.update({ _id: chair._id }, chair);
  }

}