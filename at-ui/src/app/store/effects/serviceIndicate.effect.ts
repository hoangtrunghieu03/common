import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import {
    ServiceIndicateAction,
    onLoadServiceIndicateSuccess,
    onLoadServiceIndicateByIdSuccess,
    onLoadServiceIndicateFilterSuccess,
    onLoadServiceIndicate,
    onLoadTagServiceIndicateSuccess
} from '../actions/serviceIndicate.action';
import { hiddenProgress } from '../actions/progress.action';
import { showNotify } from '../actions/notify.action';
import { RootState } from '../entities/state.entity';
import StoreConstants from '../utils/store.constant';
import { MedicalServiceService } from '../services/medicalService.service';
import { ServiceIndicateService } from '../services/serviceIndicate.service';
import MedicalServiceIndicate from '../../../../../at-common/model/MedicalServiceIndicate';
import MedicalServiceIndicateReport from '../../../../../at-common/model/MedicalServiceIndicateReport';
import { AuthencationService } from '../services/authentication.service';

@Injectable()
export class ServiceIndicateEffect {

    @Effect()
    onLoadServiceIndicate$ = this.actions$.pipe(
        ofType(ServiceIndicateAction.onLoadServiceIndicate),
        mergeMap(() =>
            fromPromise(this.serviceIndicateService.onLoadMedicalService())
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadServiceIndicateSuccess({ serviceIndicates: val.entity }),
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


    @Effect()
    onLoadTagServiceIndicate$ = this.actions$.pipe(
        ofType(ServiceIndicateAction.onLoadTagServiceIndicate),
        mergeMap(() => 
            fromPromise(this.serviceIndicateService.onLoadTagServiceIndicate())
            .pipe(
                mergeMap((val) =>{
                    return [
                        onLoadTagServiceIndicateSuccess({tagServiceIndeicate : val.entity}),
                        hiddenProgress()
                    ];
                }),
                catchError(err =>
                    this.authenService.handleAuthError(err, of(showNotify({
                        notifyType: 'error',
                        message: err.message
                    }), hiddenProgress()))
                )
            )
        )
    )


    @Effect()
    onLoadServiceIndicateById$ = this.actions$.pipe(
        ofType(ServiceIndicateAction.onLoadServiceIndicateById),
        mergeMap((action: Action & MedicalServiceIndicate) =>
            fromPromise(this.serviceIndicateService.onLoadServiceIndicateById(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadServiceIndicateByIdSuccess(val.entity),
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

    @Effect()
    onUpdateServiceIndicate$ = this.actions$.pipe(
        ofType(ServiceIndicateAction.onUpdateServiceIndicate),
        mergeMap((action: Action & MedicalServiceIndicate) =>
            fromPromise(this.serviceIndicateService.onUpdateServiceIndicate(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            showNotify({
                                notifyType: 'success',
                                message: StoreConstants.UPDATE_SERVICE_INDICATE_SUCESSFULLY + ' '
                                    + `<span class='f-w-700 primary-color'>${val.entity?.name}</span>`
                            }),
                            onLoadServiceIndicateByIdSuccess(val.entity),
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


    @Effect()
    onRemoveServiceIndicate$ = this.actions$.pipe(
        ofType(ServiceIndicateAction.onRemoveServiceIndicate),
        mergeMap((action: Action & MedicalServiceIndicate) =>
            fromPromise(this.serviceIndicateService.onRemoveServiceIndicate(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            showNotify({
                                notifyType: 'success',
                                message: StoreConstants.DELETE_SERVICE_INDICATE_SUCESSFULLY + ' '
                                    + `<span class='f-w-700 primary-color'>${action?.name}</span>`
                            }),
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

    @Effect()
    onCreateServiceIndicate$ = this.actions$.pipe(
        ofType(ServiceIndicateAction.onCreateServiceIndicate),
        mergeMap((action: Action & MedicalServiceIndicate) =>
            fromPromise(this.serviceIndicateService.onCreateServiceIndicate(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadServiceIndicate(),
                            showNotify({
                                notifyType: 'success',
                                message: StoreConstants.CREATE_SERVICE_INDICATE_SUCESSFULLY + ' '
                                    + `<span class='f-w-700 primary-color'>${val.entity?.name}</span>`
                            }),
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

    @Effect()
    onLoadServiceIndicateFilter$ = this.actions$.pipe(
        ofType(ServiceIndicateAction.onLoadServiceIndicateFilter),
        mergeMap((action: Action & MedicalServiceIndicateReport) =>
            fromPromise(this.serviceIndicateService.onLoadServiceIndicateFilter(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadServiceIndicateFilterSuccess({ serviceIndicateFilter: val.entity }),
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
        private serviceIndicateService: ServiceIndicateService,
        private store: Store<RootState>,
        private authenService: AuthencationService
    ) { }
}
