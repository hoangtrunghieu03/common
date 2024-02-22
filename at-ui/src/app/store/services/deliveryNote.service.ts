import { Injectable } from '@angular/core';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import DeliveryNote from '../../../../../at-common/model/DeliveryNote';
import DeliveryNoteManager from '../../../../../at-common/model/manager/DeliveryNoteManager';
import { Store } from '@ngrx/store';
import { RootState } from '../entities/state.entity';
import { showProgress } from '../actions/progress.action';

@Injectable()
export class DeliveryNoteService {

  constructor(
    private store: Store<RootState>
  ) { }

  async onLoadDeliveryNote(): Promise<HttpStatus<DeliveryNote[]>> {
    this.store.dispatch(showProgress());
    const deliveryNoteManager = new DeliveryNoteManager(null);
    return deliveryNoteManager.search(null);
  }

  async onCreateDeliveryNote(deliveryNote: DeliveryNote): Promise<HttpStatus<DeliveryNote>> {
    this.store.dispatch(showProgress());
    const deliveryNoteManager = new DeliveryNoteManager(null);
    return deliveryNoteManager.insert(deliveryNote);
  }
}