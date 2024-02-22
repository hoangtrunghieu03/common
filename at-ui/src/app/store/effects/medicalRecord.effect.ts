import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

import {
    MedicalRecordAction,
    onCreateMedicalRecord,
    onLoadMedicalRecordByDate,
    onLoadMedicalRecordByDateSuccess,
    onLoadMedicalRecordById,
    onLoadMedicalRecordByIdSuccess,
    onLoadMedicalRecordFilterSuccess,
    onLoadMedicalRecordPaymentHistory,
    onLoadMedicalRecordPaymentHistorySuccess,
    onReceiveCustomerToRoom
} from '../actions/medicalRecord.action';
import { MedicalRecordService } from '../services/medicalRecord.service';
import { hiddenProgress } from '../actions/progress.action';
import { showNotify } from '../actions/notify.action';
import { RootState } from '../entities/state.entity';
import MedicalRecord from '../../../../../at-common/model/MedicalRecord';
import { NavigationExtras, Router } from '@angular/router';
import StoreConstants from '../utils/store.constant';
import { onLoadCustomerByCode, onLoadCustomersFilter } from '../actions/customer.action';
import CustomerReport from '../../../../../at-common/model/CustomerReport';
import CustomerCriterial from '../../../../../at-common/model/CustomerCriterial';
import { RoomList } from 'src/app/shared/enum/share.enum';
import { Location } from '@angular/common';
import { onLoadChair, onLoadChairByStaff } from '../actions/chair.action';
import { DataCustomToPrint, PRINT_TYPE, RoomInfo } from '../../shared/data/at.model';
import * as _ from 'lodash';
import { AuthencationService } from '../services/authentication.service';
import { PrintService } from 'src/app/shared/service/print.service';
import { onLoadMedicalRecordDetailByIdSuccess } from '../actions/medicalRecord.action';
import { ROOM_STATUS } from '../../../../../at-common/model/enum';
import PaymentHistory from '../../../../../at-common/model/PaymentHistory';

@Injectable()
export class MedicalRecordEffect {

    @Effect()
    onCreateMedicalRecord$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onCreateMedicalRecord),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onCreateMedicalRecord(action))
                .pipe(
                    mergeMap((val) => {
                        this.router.navigate(['kham-benh/phong-tiep-tan/I'], {
                            queryParams: {
                                _id: val.entity?._id
                            }
                        })
                        return [
                            showNotify({
                                notifyType: 'success', message: StoreConstants.CREATE_CUSTOMER_SUCESSFULLY + ' '
                                    + `<span class='f-w-700 primary-color'>${action.customer?.fullName}</span>`
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
    onCreateMedicalRecordOther$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onCreateMedicalRecordOther),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onCreateMedicalRecord(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            showNotify({
                                notifyType: 'success', message: 'Đã tạo mới hồ sơ bệnh án ở phòng '
                                    + `<span class='f-w-700 primary-color'>${val.entity?.serviceRequest}</span>`
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
    public onLoadMedicalRecordById$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onLoadMedicalRecordById),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onLoadMedicalRecordById(action))
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadMedicalRecordByIdSuccess(value.entity),
                            onLoadCustomerByCode({ customerCode: value.entity.customerCode }),
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
    public onDeletePayHistoryMedicalRecord$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onDeletePayHistoryMedicalRecord),
        mergeMap((action: Action & PaymentHistory) =>
            fromPromise(this.medicalRecordService.onDeletePayHistoryMedicalRecord(action))
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadMedicalRecordPaymentHistory({ medicalRecordCode: action.medicalRecordCode }),
                            showNotify({
                              notifyType: 'success', message: StoreConstants.DELETE_PAYMENT_HISTORY_MEDICALRECORD_SUCESSFULLY}),
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
    public onLoadMedicalRecordDetailById$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onLoadMedicalRecordDetailById),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onLoadMedicalRecordById(action))
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadMedicalRecordDetailByIdSuccess(value.entity),
                            onLoadCustomerByCode({ customerCode: value.entity.customerCode }),
                            onLoadMedicalRecordPaymentHistory({ medicalRecordCode: value.entity.medicalRecordCode }),
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
    public onLoadMedicalRecordByDate$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onLoadMedicalRecordByDate),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onLoadMedicalRecordByDate(action))
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadMedicalRecordByDateSuccess(value.entity),
                            onLoadCustomerByCode({ customerCode: value.entity.customerCode }),
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
    public onLoadMedicalRecordPaymentHistory$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onLoadMedicalRecordPaymentHistory),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onLoadMedicalRecordPaymentHistory(action))
                .pipe(
                    mergeMap(value => {
                        return [
                            onLoadMedicalRecordPaymentHistorySuccess({ paymentHistory: value.entity }),
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
    onMedicalRecordPayment$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onMedicalRecordPayment),
        mergeMap((action: any) =>
            fromPromise(this.medicalRecordService.onMedicalRecordPayment(action.medicalRecord))
                .pipe(
                    mergeMap((val) => {
                        action.print && this.prepareDataToPrint(action.medicalRecord, val.entity);
                        return [
                            onLoadMedicalRecordByIdSuccess(val.entity),
                            showNotify({ notifyType: 'success', message: StoreConstants.PAYMENT_MEDICALRECORD_SUCESSFULLY }),
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
    onMedicalRecordOldPayment$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onMedicalRecordOldPayment),
        mergeMap((action: any) =>
            fromPromise(this.medicalRecordService.onMedicalRecordPayment(action.medicalRecord))
                .pipe(
                    mergeMap((val) => {
                        action.print && this.prepareDataToPrint(action.medicalRecord, val.entity);
                        return [
                            onLoadMedicalRecordDetailByIdSuccess(val.entity),
                            onLoadMedicalRecordPaymentHistory({ medicalRecordCode: val.entity.medicalRecordCode }),
                            showNotify({ notifyType: 'success', message: StoreConstants.PAYMENT_MEDICALRECORD_SUCESSFULLY }),
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
    onUpdateMedicalRecordGeneral$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onUpdateMedicalRecordGeneral),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onUpdateMedicalRecordGeneral(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalRecordByIdSuccess(val.entity),
                            showNotify({ notifyType: 'success', message: StoreConstants.CREATE_MEDICALRECORD_GENERAL_SUCESSFULLY }),
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
    onUpdateMedicalRecordImplant$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onUpdateMedicalRecordImplant),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onUpdateMedicalRecordImplant(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalRecordByIdSuccess(val.entity),
                            showNotify({ notifyType: 'success', message: StoreConstants.CREATE_MEDICALRECORD_GENERAL_SUCESSFULLY }),
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
    onUpdateMedicalRecordBrace$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onUpdateMedicalRecordBrace),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onUpdateMedicalRecordBrace(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalRecordByIdSuccess(val.entity),
                            showNotify({ notifyType: 'success', message: StoreConstants.CREATE_MEDICALRECORD_GENERAL_SUCESSFULLY }),
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
    onAddTreatmentProcess$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onAddTreatmentProcess),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onAddTreatmentProcess(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalRecordByIdSuccess(val.entity),
                            showNotify({ notifyType: 'success', message: StoreConstants.CREATE_TREATMENTPROGRESS_SUCESSFULLY }),
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
    onUpdateTreatmentProcess$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onUpdateTreatmentProcess),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onAddTreatmentProcess(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalRecordByIdSuccess(val.entity),
                            showNotify({ notifyType: 'success', message: StoreConstants.UPDATE_TREATMENTPROGRESS_SUCESSFULLY }),
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
    onFinishTreatmentProcess$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onFinishTreatmentProcess),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onFinishTreatmentProcess(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalRecordByIdSuccess(val.entity),
                            showNotify({ notifyType: 'success', message: StoreConstants.FINISH_TREATMENTPROGRESS_SUCESSFULLY }),
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
    onAddMedicalServiceIndicates$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onAddMedicalServiceIndicates),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onAddMedicalServiceIndicates(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalRecordByIdSuccess(val.entity),
                            showNotify({ notifyType: 'success', message: StoreConstants.ADD_DESIGNAT_SUCESSFULLY }),
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
    onAddMedicalService$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onAddMedicalService),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onAddMedicalService(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalRecordByIdSuccess(val.entity),
                            showNotify({ notifyType: 'success', message: StoreConstants.ADD_SERVICE_SUCESSFULLY }),
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
    public onDeleteTreatmentProcess$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onDeleteTreatmentProcess),
        mergeMap((action: Action & MedicalRecord) => fromPromise(this.medicalRecordService.onDeleteTreatmentProcess(action))
            .pipe(
                mergeMap(value => {
                    return [
                        onLoadMedicalRecordById({ id: action._id }),
                        showNotify({ notifyType: 'success', message: StoreConstants.DELETE_TREATMENTPROGRESS_SUCESSFULLY }),
                        hiddenProgress()];
                }), catchError(err =>
                    this.authenService.handleAuthError(err, of(showNotify({
                        notifyType: 'error',
                        message: err.message
                    }), hiddenProgress()))
                ))
        )
    );

    @Effect()
    onTransferRoom$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onTransferRoom),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onTransferRoom(action))
                .pipe(
                    mergeMap((val) => {
                        let roomInfo: any = action;
                        this.handleNavigateRoom(roomInfo.roomName);
                        if (roomInfo.roomStatus == ROOM_STATUS.SEE_YOU) {
                            let data = { _id: val.entity._id, roomStatus: roomInfo.roomStatus };
                            this.store.dispatch(onReceiveCustomerToRoom(data));
                        }
                        return [
                            showNotify({
                                notifyType: 'success', message: StoreConstants.TRANSFER_ROOM_SUCESSFULLY + ' '
                                    + `<span class='f-w-700 primary-color'>${roomInfo.toRoomName}</span>`
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
    onTransferRoomAndResetChair$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onTransferRoomAndResetChair),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onTransferRoom(action))
                .pipe(
                    mergeMap((val: any) => fromPromise(this.medicalRecordService.onReceiveCustomerToRoom({ _id: val.entity._id, roomStatus: action.roomStatus }))
                        .pipe(
                            mergeMap((value) => {
                                return [
                                    onLoadChairByStaff(),
                                    showNotify({
                                        notifyType: 'success', message: StoreConstants.TRANSFER_ROOM_SUCESSFULLY + ' '
                                            + `<span class='f-w-700 primary-color'>${action.toRoomName}</span>`
                                    }),
                                    hiddenProgress()
                                ];
                            })
                        )),
                    catchError((err) =>
                        of(
                            showNotify({
                                notifyType: 'error',
                                message: err.message,
                            })
                        )
                    )
                )
        ),
        catchError((err) =>
            of(
                showNotify({
                    notifyType: 'error',
                    message: err.message,
                })
            )
        )
    );

    @Effect()
    onReceiveCustomerToRoom$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onReceiveCustomerToRoom),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onReceiveCustomerToRoom(action))
                .pipe(
                    mergeMap((val) => {
                        return [
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
    onMedicalCustomerChair$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onMedicalCustomerChair),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onMedicalCustomerChair(action))
                .pipe(
                    mergeMap((val) => {
                        let _id = action._id;
                        return [
                            onLoadChairByStaff(),
                            // onLoadMedicalRecordById({ id: _id }),
                            showNotify({ notifyType: 'success', message: StoreConstants.UPDATE_CHAIR_SUCESSFULLY }),
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
    onMedicalSICommand$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onMedicalSICommand),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onMedicalSICommand(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalRecordByIdSuccess(val.entity),
                            showNotify({ notifyType: 'success', message: StoreConstants.UPDATE_SIC_SUCESSFULLY }),
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
    onExaminationFinish$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onExaminationFinish),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onExaminationFinish(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalRecordByIdSuccess(val.entity),
                            showNotify({ notifyType: 'success', message: StoreConstants.EXAMINATION_FINISH }),
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
    onMedicalRecordFinish$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onMedicalRecordFinish),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onMedicalRecordFinish(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            showNotify({ notifyType: 'success', message: StoreConstants.EXAMINATION_FINISH }),
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
    onMedicalServiceCommand$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onMedicalServiceCommand),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onMedicalServiceCommand(action))
                .pipe(
                    mergeMap((val) => {
                        console.log(val)
                        return [
                            onLoadMedicalRecordByIdSuccess(val.entity),
                            showNotify({ notifyType: 'success', message: StoreConstants.UPDATE_SIC_SUCESSFULLY }),
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
    onCreateMedicalRecordAndTranferRoom$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onCreateMedicalRecordAndTranferRoom),
        mergeMap((action: any) =>
            fromPromise(this.medicalRecordService.onCreateMedicalRecord(action.medicalRecord))
                .pipe(
                    mergeMap((val: any) => fromPromise(this.medicalRecordService.onTransferRoom(this.onMoveRoome(val.entity, action.roomInfo)))
                        .pipe(
                            mergeMap((value) => {
                                let roomInfo: any = action.roomInfo;
                                return [
                                    showNotify({
                                        notifyType: 'success', message: StoreConstants.TRANSFER_ROOM_SUCESSFULLY + ' '
                                            + `<span class='f-w-700 primary-color'>${roomInfo.toRoomName}</span>`
                                    }),
                                    hiddenProgress()
                                ];
                            })
                        )),
                    catchError((err) =>
                        of(
                            showNotify({
                                notifyType: 'error',
                                message: err.message,
                            })
                        )
                    )
                )
        ),
        catchError((err) =>
            of(
                showNotify({
                    notifyType: 'error',
                    message: err.message,
                })
            )
        )
    );

    @Effect()
    onAddMedicalServiceIndicatesAndTranferRoom$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onAddMedicalServiceIndicatesAndTranferRoom),
        mergeMap((action: any) =>
            fromPromise(this.medicalRecordService.onAddMedicalServiceIndicates({ _id: action._id, medicalServiceIndicatesUpdate: action.medicalServiceIndicatesUpdate }))
                .pipe(
                    mergeMap((val: any) => fromPromise(this.medicalRecordService.onTransferRoom(action.roomInfo))
                        .pipe(
                            mergeMap((value) => {
                                let roomInfo: any = action.roomInfo;
                                this.handleNavigateRoom(roomInfo.roomName);
                                return [
                                    showNotify({
                                        notifyType: 'success', message: StoreConstants.ADD_DESIGNAT_SUCESSFULLY + ' và ' + StoreConstants.TRANSFER_ROOM_SUCESSFULLY + ' '
                                            + `<span class='f-w-700 primary-color'>${roomInfo.toRoomName}</span>`
                                    }),
                                    hiddenProgress()
                                ];
                            })
                        )),
                    catchError((err) =>
                        of(
                            showNotify({
                                notifyType: 'error',
                                message: err.message,
                            })
                        )
                    )
                )
        ),
        catchError((err) =>
            of(
                showNotify({
                    notifyType: 'error',
                    message: err.message,
                })
            )
        )
    );

    @Effect()
    onReExamination$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onReExamination),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onReExamination(action))
                .pipe(
                    mergeMap((val) => {
                        this.router.navigate(['benh-an']);
                        return [
                            showNotify({
                                notifyType: 'success', message: 'Tái khám thành công'
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
    onUpdateMedicalRecordName$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onUpdateMedicalRecordName),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onUpdateMedicalRecordName(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalRecordDetailByIdSuccess(val.entity),
                            showNotify({
                                notifyType: 'success', message: StoreConstants.UPDATE_SUCESSFULLY
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
    onRemoveExamination$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onRemoveExamination),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onRemoveExamination(action))
                .pipe(
                    mergeMap((val) => {
                        this.router.navigate(['benh-an']);
                        return [
                            showNotify({
                                notifyType: 'success', message: StoreConstants.DELETE_SUCESSFULLY
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
    onMedicalRecordNote$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onMedicalRecordNote),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onMedicalRecordNote(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalRecordByIdSuccess(val.entity),
                            showNotify({
                                notifyType: 'success', message: StoreConstants.UPDATE_SUCESSFULLY
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
    onMedicalRecordImages$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onMedicalRecordImages),
        mergeMap((action: Action & { _id: string, images: Array<any>, date: string }) =>
            fromPromise(this.medicalRecordService.onMedicalRecordImages(action))
                .pipe(
                    mergeMap((val) => {
                        if (action.date) {
                            this.store.dispatch(onLoadMedicalRecordByDate({ id: val.entity._id, examinationDate: action.date }));
                        } else {
                            this.store.dispatch(onLoadMedicalRecordByIdSuccess(val.entity));
                            this.store.dispatch(onLoadMedicalRecordDetailByIdSuccess(val.entity));
                        }
                        return [
                            showNotify({
                                notifyType: 'success', message: StoreConstants.UPDATE_SUCESSFULLY
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
    onLoadMedicalRecordFilter$ = this.actions$.pipe(
        ofType(MedicalRecordAction.onLoadMedicalRecordFilter),
        mergeMap((action: Action & MedicalRecord) =>
            fromPromise(this.medicalRecordService.onLoadMedicalRecordFilter(action))
                .pipe(
                    mergeMap((val) => {
                        return [
                            onLoadMedicalRecordFilterSuccess({ medicalRecordFilter: val.entity }),
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

    handleNavigateRoom = (roomName: string): void => {
        switch (roomName?.toLowerCase()) {
            case RoomList.minorsurgery.toLowerCase():
                this.router.navigate(['kham-benh/phong-tieu-phau'])
                break;
            case RoomList.implant.toLowerCase():
                this.router.navigate(['kham-benh/phong-cay-implant'])
                break;
            case RoomList.designat.toLowerCase():
                this.router.navigate(['kham-benh/phong-chi-dinh'])
                break;
            case RoomList.braces.toLowerCase():
                this.router.navigate(['kham-benh/phong-nieng-rang'])
                break;
            case RoomList.reception.toLowerCase():
                this.router.navigate(['kham-benh/phong-tiep-tan'])
                break;
            case RoomList.general.toLowerCase():
                this.router.navigate(['kham-benh/phong-tong-quat'])
                break;
            default:
                break;
        }
    }

    onMoveRoome = (medicalRecord: MedicalRecord, roomInfo: RoomInfo) => {
        let room = _.cloneDeep(roomInfo)
        room._id = medicalRecord._id;
        return room;
    }

    prepareDataToPrint = (dataPayment, medicalRecord: MedicalRecord): void => {
        let dataCustom: DataCustomToPrint = new DataCustomToPrint();

        dataCustom.customerCode = medicalRecord.customerCode;
        dataCustom.medicalServiceIndicates = medicalRecord.medicalServiceIndicates;
        dataCustom.medicalServices = medicalRecord.medicalServices;

        dataCustom.totalMoney = medicalRecord?.payment?.totalMoney;
        dataCustom.moneyPaymented = (medicalRecord?.payment?.moneyPaymented - dataPayment.currentPayment.moneyCustomerProvide);
        dataCustom.totalAfterDiscount = (medicalRecord?.payment?.totalMoney - medicalRecord?.payment?.discountAmount);
        dataCustom.moneyPayment = medicalRecord?.payment?.moneyPayment;
        dataCustom.moneyIncome = dataPayment.currentPayment.moneyCustomerProvide;
        dataCustom.paymentDate = dataPayment.currentPayment?.paymentDate;
        dataCustom.discountAmount = medicalRecord?.payment?.discountAmount;

        dataCustom.staffId = medicalRecord?.staffId;
        this.printService.onGetMedicalRecordDataPrint(JSON.stringify(dataCustom));
        this.printService.onPrint(medicalRecord._id, PRINT_TYPE.MEDICAL_RECORD);
    }

    constructor(
        private actions$: Actions,
        private medicalRecordService: MedicalRecordService,
        private store: Store<RootState>,
        private router: Router,
        private location: Location,
        private authenService: AuthencationService,
        private printService: PrintService
    ) { }
}
