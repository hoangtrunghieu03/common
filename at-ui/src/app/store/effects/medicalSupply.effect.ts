import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, mergeMap, filter } from 'rxjs/operators';
import * as _ from 'lodash';
import MedicalSupply from '../../../../../at-common/model/MedicalSupply';
import MedicalSupplyReport from '../../../../../at-common/model/MedicalSupplyReport';
import {
    MedicalSupplyAction,
    onLoadMedicalSupply,
    onLoadMedicalSupplyById,
    onLoadMedicalSupplyByIdSuccess,
    onLoadMedicalSupplyFilter,
    onLoadMedicalSupplyFilterSuccess,
    onLoadMedicalSupplySuccess,
    onLoadMedicalSupplyUnitSuccess
} from '../actions/medicalSupply.action';
import { showNotify } from '../actions/notify.action';
import { RootState } from '../entities/state.entity';
import { MedicalSupplyService } from '../services/medicalSupply.service';
import StoreConstants from '../utils/store.constant';
import MedicalSupplyCriterial from '../../../../../at-common/model/MedicalSupplyCriterial';
import MedicalSupplyRoom from '../../../../../at-common/model/MedicalSupplyRoom';
import { onCreateMedicalSupply } from '../actions/medicalSupply.action';
import { AuthencationService } from '../services/authentication.service';
import { hiddenProgress } from '../actions/progress.action';
import { onLoadMedicalSupplyRequest } from '../actions/medicalSupplyRequest.action';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

@Injectable()
export class MedicalSupplyEffect {

    @Effect()
    onLoadMedicalSupply$ = this.actions$.pipe(
        ofType(MedicalSupplyAction.onLoadMedicalSupply),
        mergeMap(() =>
            fromPromise(this.medicalSupplyService.onLoadMedicalSupply())
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalSupplySuccess({ medicalSupply: val.entity }),
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
    onCreateMedicalSupply$ = this.actions$.pipe(
        ofType(MedicalSupplyAction.onCreateMedicalSupply),
        mergeMap((action: Action & { medicalSupply: MedicalSupply, medicalSupplyFilter: MedicalSupplyReport }) =>
            fromPromise(this.medicalSupplyService.onCreateMedicalSupply(action.medicalSupply))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalSupplyFilter(action.medicalSupplyFilter),
                            showNotify({
                                notifyType: 'success',
                                message: StoreConstants
                                    .CREATE_SUPPLY_SUCESSFULLY + ' '
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
    onUpdateMedicalSupply$ = this.actions$.pipe(
        ofType(MedicalSupplyAction.onUpdateMedicalSupply),
        mergeMap((action: Action & MedicalSupply) =>
            fromPromise(this.medicalSupplyService.onUpdateMedicalSupply(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            showNotify({
                                notifyType: 'success',
                                message: StoreConstants
                                    .UPDATE_SUPPLY_SUCESSFULLY + ' '
                                    + `<span class='f-w-700 primary-color'>${val.entity?.name}</span>`
                            }),
                            onLoadMedicalSupplyByIdSuccess(val.entity),
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
    onRemoveMedicalSupply$ = this.actions$.pipe(
        ofType(MedicalSupplyAction.onRemoveMedicalSupply),
        mergeMap((action: Action & MedicalSupply) =>
            fromPromise(this.medicalSupplyService.onRemoveMedicalSupply(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            showNotify({
                                notifyType: 'success',
                                message: StoreConstants
                                    .DELETE_SUPPLY_SUCESSFULLY + ' '
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
    onImportMedicalSupply$ = this.actions$.pipe(
        ofType(MedicalSupplyAction.onImportMedicalSupply),
        mergeMap((action: any) =>
            fromPromise(this.medicalSupplyService.onImportMedicalSupply(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalSupplyById({ _id: val.entity._id }),
                            showNotify({
                                notifyType: 'success',
                                message: StoreConstants.WAREHOUSE_SUPPLY_SUCESSFULLY
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
    onExportMedicalSupply$ = this.actions$.pipe(
        ofType(MedicalSupplyAction.onExportMedicalSupply),
        mergeMap((action: Action & { medicalSupply: MedicalSupplyRoom, medicalSupplyFilter: MedicalSupplyReport }) =>
            fromPromise(this.medicalSupplyService.onExportMedicalSupply(action.medicalSupply))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalSupplyFilter(action.medicalSupplyFilter),
                            showNotify({
                                notifyType: 'success',
                                message: 'Đã xuất vật dụng tiêu hao'
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
    onExportMedicalSupplyRequest$ = this.actions$.pipe(
        ofType(MedicalSupplyAction.onExportMedicalSupplyRequest),
        mergeMap((action: Action & MedicalSupplyRoom ) =>
            fromPromise(this.medicalSupplyService.onExportMedicalSupply(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalSupplyRequest(),
                            showNotify({
                                notifyType: 'success',
                                message: 'Đã xuất vật dụng tiêu hao'
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
    onReturnMedicalSupply$ = this.actions$.pipe(
        ofType(MedicalSupplyAction.onReturnMedicalSupply),
        mergeMap((action: Action & MedicalSupplyRoom ) =>
            fromPromise(this.medicalSupplyService.onReturnMedicalSupply(action))
                .pipe(
                    mergeMap((val) => {
                        let filtersModel = new MedicalSupplyReport();
                        let filter = { ...filtersModel.filter }
                        filter.roomId = action.roomId;
                        filtersModel.filter = filter;
                        return [
                            onLoadMedicalSupplyFilter(filtersModel ),
                            showNotify({
                                notifyType: 'success',
                                message: 'Đã trả dụng đến kho'
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
    onAdjustMedicalInput$ = this.actions$.pipe(
        ofType(MedicalSupplyAction.onAdjustMedicalInput),
        mergeMap((action: Action & { medicalSupply: MedicalSupplyRoom, medicalSupplyFilter: MedicalSupplyReport }) =>
            fromPromise(this.medicalSupplyService.onAdjustMedicalInput(action.medicalSupply))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalSupplyFilter(action.medicalSupplyFilter),
                            showNotify({
                                notifyType: 'success',
                                message: 'Đã điều chỉnh vật liệu'
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
    onLoadMedicalSupplyById$ = this.actions$.pipe(
        ofType(MedicalSupplyAction.onLoadMedicalSupplyById),
        mergeMap((action: Action & MedicalSupply) =>
            fromPromise(this.medicalSupplyService.onLoadMedicalSupplyById(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalSupplyByIdSuccess(val.entity),
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
    onLoadMedicalSupplyFilter$ = this.actions$.pipe(
        ofType(MedicalSupplyAction.onLoadMedicalSupplyFilter),
        mergeMap((action: Action & MedicalSupplyReport) =>
            fromPromise(this.medicalSupplyService.onLoadMedicalSupplyFilter(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalSupplyFilterSuccess({ medicalSupplyFilter: val.entity }),
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
    adjustMedicalSupplyByRoom$ = this.actions$.pipe(
        ofType(MedicalSupplyAction.adjustMedicalSupplyByRoom),
        mergeMap((action: Action & MedicalSupply) =>
            fromPromise(this.medicalSupplyService.adjustMedicalSupplyByRoom(action))
                .pipe(
                    mergeMap((val) => {
                        let filters = new MedicalSupplyReport();
                        let filter = { ...filters.filter }
                        filter.roomId = action.roomId
                        filters.filter = filter;
                        return [
                            onLoadMedicalSupplyFilter(filters),
                            showNotify({
                              notifyType: 'success',
                              message: 'Đã điều chỉnh vật liệu theo phòng'
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
    onLoadMedicalSupplyUnit$ = this.actions$.pipe(
        ofType(MedicalSupplyAction.onLoadMedicalSupplyUnit),
        mergeMap(() => fromPromise(this.medicalSupplyService.onLoadMedicalSupplyUnit())
        .pipe(
            mergeMap(val =>{
                return[
                    onLoadMedicalSupplyUnitSuccess({medicalSupplyUnit : val.entity}),
                    hiddenProgress()
                ]
            }), catchError(err =>
                this.authenService.handleAuthError(err, of(showNotify({
                    notifyType: 'error',
                    message: err.message
                }), hiddenProgress()))
            ))
        )
    );

    onLoadMedicalServiceFilter = () => {
        let medicalSupplyReport = new MedicalSupplyReport();
        let medicalSupplyFilter = new MedicalSupplyCriterial();
        medicalSupplyReport.filter = medicalSupplyFilter;

        this.store.dispatch(onLoadMedicalSupplyFilter(medicalSupplyReport));
    }

    constructor(
        private actions$: Actions,
        private medicalSupplyService: MedicalSupplyService,
        private store: Store<RootState>,
        private authenService: AuthencationService
    ) { }
}
