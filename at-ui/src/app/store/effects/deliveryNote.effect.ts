import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, mergeMap } from 'rxjs/operators';
import DeliveryNote from '../../../../../at-common/model/DeliveryNote';
import MedicalScheduleReport from '../../../../../at-common/model/MedicalScheduleReport';
import { DeliveryNoteAction, onLoadDeliveryNoteSuccess } from '../actions/DeliveryNote.action';
import { onLoadArcMakingFilter } from '../actions/medicalSchedule.action';
import { showNotify } from '../actions/notify.action';
import { hiddenProgress } from '../actions/progress.action';
import { AuthencationService } from '../services/authentication.service';
import { DeliveryNoteService } from '../services/deliveryNote.service';


@Injectable()
export class DeliveryNoteEffect {

    @Effect()
    onLoadDeliveryNote$ = this.actions$
        .pipe(
            ofType(DeliveryNoteAction.onLoadDeliveryNote),
            mergeMap(() => fromPromise(this.deliveryNoteService.onLoadDeliveryNote())
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadDeliveryNoteSuccess({ deliveryNote: result.entity }),
                            hiddenProgress()
                        ]
                    }), catchError(err =>
                        this.authenService.handleAuthError(err, of(showNotify({
                            notifyType: 'error',
                            message: err.message
                        }), hiddenProgress()))
                    ))
            )
        )

    @Effect()
    onCreateDeliveryNote$ = this.actions$
        .pipe(
            ofType(DeliveryNoteAction.onCreateDeliveryNote),
            mergeMap((action: Action & { deliveryNote: DeliveryNote, scheduleReport: MedicalScheduleReport }) => fromPromise(this.deliveryNoteService.onCreateDeliveryNote(action.deliveryNote))
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadArcMakingFilter(action.scheduleReport),
                            showNotify({ notifyType: 'success', message: 'Tạo phiếu thành công' }),
                            hiddenProgress()
                        ]
                    }), catchError(err =>
                        this.authenService.handleAuthError(err, of(showNotify({
                            notifyType: 'error',
                            message: err.message
                        }), hiddenProgress()))
                    ))
            )
        )

    constructor(private actions$: Actions,
        private deliveryNoteService: DeliveryNoteService,
        private authenService: AuthencationService) {
    }
}