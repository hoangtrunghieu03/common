import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';
import StoreConstants from '../utils/store.constant';

import {
    loadMedicalEquipment, loadMedicalEquipmentSuccess, MedicalEquipmentAction,
    onLoadMedicalSupplyHistorySuccess, loadMedicalEquipmentById,
    loadMedicalEquipmentByIdSuccess, onUpdateMedicalEquipment, onRemoveMedicalEquipment, onLoadUnitSupplyHistorySuccess
} from '../actions/medicalEquipment.action';
import { MedicalEquipmentService } from '../services/medicalEquipment.service';
import MedicalEquipment from '../../../../../at-common/model/MedicalEquipment';

import { hiddenProgress } from '../actions/progress.action';
import { showNotify } from '../actions/notify.action';
import MedicalSupplyHistoryReport from '../../../../../at-common/model/MedicalSupplyHistoryReport';
import { AuthencationService } from '../services/authentication.service';


@Injectable()
export class MedicalEquipmentEffect {

    @Effect() public loadMedicalEquipment$ = this.actions$
        .pipe(
            ofType(MedicalEquipmentAction.loadMedicalEquipment),
            mergeMap(() => fromPromise(this.medicalEquipmentService.loadAllEquipment())
                .pipe(
                    mergeMap(value => {
                        return [
                            loadMedicalEquipmentSuccess({ medicalEquipmentList: value.entity }),
                            hiddenProgress()
                        ];
                    }), catchError(err =>
                        this.authenService.handleAuthError(err, of(showNotify({
                            notifyType: 'error',
                            message: err.message
                        }), hiddenProgress()))
                    ))
            ),
        );

    @Effect()
    loadMedicalEquipmentById$ = this.actions$.pipe(
        ofType(MedicalEquipmentAction.loadMedicalEquipmentById),
        mergeMap((action: Action & MedicalEquipment) =>
            fromPromise(this.medicalEquipmentService.onLoadMedicalEquipmentById(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            loadMedicalEquipmentByIdSuccess(val.entity),
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
    onCreatMedicalEquipment$ = this.actions$.pipe(
        ofType(MedicalEquipmentAction.onCreatMedicalEquipment),
        mergeMap((action: Action & MedicalEquipment) =>
            fromPromise(this.medicalEquipmentService.onCreatMedicalEquipment(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            showNotify({
                                notifyType: 'success',
                                message: StoreConstants
                                    .CREATE_SUPPLY_EQUIPMENT_SUCESSFULLY + ' '
                                    + `<span class='f-w-700 primary-color'>${val.entity?.name}</span>`
                            }),
                            loadMedicalEquipment(),
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
    onUpdateMedicalEquipment$ = this.actions$.pipe(
        ofType(MedicalEquipmentAction.onUpdateMedicalEquipment),
        mergeMap((action: Action & MedicalEquipment) =>
            fromPromise(this.medicalEquipmentService.onUpdateMedicalEquipment(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            showNotify({
                                notifyType: 'success',
                                message: StoreConstants
                                    .UPDATE_SUPPLY_EQUIPMENT_SUCESSFULLY + ' '
                                    + `<span class='f-w-700 primary-color'>${val.entity?.name}</span>`
                            }),
                            loadMedicalEquipmentByIdSuccess(val.entity),
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
    onRemoveMedicalEquipment$ = this.actions$.pipe(
        ofType(MedicalEquipmentAction.onRemoveMedicalEquipment),
        mergeMap((action: Action & MedicalEquipment) =>
            fromPromise(this.medicalEquipmentService.onRemoveMedicalEquipment(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            showNotify({
                                notifyType: 'success',
                                message: StoreConstants
                                    .DELETE_SUPPLY_EQUIPMENT_SUCESSFULLY + ' '
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
    onLoadMedicalSupplyHistory$ = this.actions$
        .pipe(
            ofType(MedicalEquipmentAction.onLoadMedicalSupplyHistory),
            mergeMap((action: Action & MedicalSupplyHistoryReport) => fromPromise(this.medicalEquipmentService.onLoadMedicalSupplyHistory(action))
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadMedicalSupplyHistorySuccess({ medicalSupplyHistoryReport: value.entity }),
                            hiddenProgress()
                        ];
                    }), catchError(err =>
                        this.authenService.handleAuthError(err, of(showNotify({
                            notifyType: 'error',
                            message: err.message
                        }), hiddenProgress()))
                    ))
            ),
        );

    @Effect()
    onLoadUnitSupplyHistory$ = this.actions$
        .pipe(
            ofType(MedicalEquipmentAction.onLoadUnitSupplyHistory),
            mergeMap(() => fromPromise(this.medicalEquipmentService.onLoadUnitSupplyHistory())
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadUnitSupplyHistorySuccess({ medicalSupplyHistory: value.entity }),
                            hiddenProgress()
                        ];
                    }), catchError(err =>
                        this.authenService.handleAuthError(err, of(showNotify({
                            notifyType: 'error',
                            message: err.message
                        }), hiddenProgress()))
                    ))
            ),
        );

    constructor(
        private actions$: Actions,
        private medicalEquipmentService: MedicalEquipmentService,
        private authenService: AuthencationService) {
    }
}