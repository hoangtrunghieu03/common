import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import {
    ServiceIndicateGroupAction,
    onLoadServiceIndicateGroupSuccess
} from '../actions/serviceIndicateGroup.action';
import { hiddenProgress } from '../actions/progress.action';
import { showNotify } from '../actions/notify.action';
import { RootState } from '../entities/state.entity';
import StoreConstants from '../utils/store.constant';
import { ServiceIndicateGroupService } from '../services/serviceIndicateGroup.service';
import { AuthencationService } from '../services/authentication.service';

@Injectable()
export class ServiceIndicateGroupEffect {

    @Effect()
    onLoadServiceIndicateGroup$ = this.actions$.pipe(
        ofType(ServiceIndicateGroupAction.onLoadServiceIndicateGroup),
        mergeMap(() =>
            fromPromise(this.serviceIndicateGroupService.onLoadMedicalServiceGroup())
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadServiceIndicateGroupSuccess({ serviceIndicateGroups: val.entity })
                        ];
                    }), catchError(err =>
                        this.authenService.handleAuthError(err, of(showNotify({
                            notifyType: 'error',
                            message: err.message
                        }), hiddenProgress()))
                    ))
        )
    );

    constructor(
        private actions$: Actions,
        private serviceIndicateGroupService: ServiceIndicateGroupService,
        private store: Store<RootState>,
        private authenService: AuthencationService
    ) { }
}
