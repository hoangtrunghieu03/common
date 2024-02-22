import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import {
    MedicalServiceGroupAction,
    onLoadMedicalServiceGroupSuccess
} from '../actions/medicalServiceGroup.action';
import { MedicalSupplyService } from '../services/medicalSupply.service';
import { hiddenProgress } from '../actions/progress.action';
import { showNotify } from '../actions/notify.action';
import { RootState } from '../entities/state.entity';
import MedicalServiceGroup from '../../../../../at-common/model/MedicalServiceGroup';
import StoreConstants from '../utils/store.constant';
import { MedicalServiceGroupService } from '../services/medicalServiceGroup.service';
import { AuthencationService } from '../services/authentication.service';

@Injectable()
export class MedicalServiceGroupEffect {

    @Effect()
    onLoadMedicalServiceGroup$ = this.actions$.pipe(
        ofType(MedicalServiceGroupAction.onLoadMedicalServiceGroup),
        mergeMap(() =>
            fromPromise(this.medicalServiceGroupService.onLoadMedicalServiceGroup())
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalServiceGroupSuccess({ medicalServiceGroups: val.entity }),
                            hiddenProgress()
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
        private medicalServiceGroupService: MedicalServiceGroupService,
        private store: Store<RootState>,
        private authenService: AuthencationService
    ) { }
}
