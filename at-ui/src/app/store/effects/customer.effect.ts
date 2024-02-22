import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

import {
  CustomerAction,
  loadCustomers,
  loadCustomersSuccess,
  onLoadCustomerByCodeSuccess,
  onLoadCustomerByIdSuccess,
  onLoadCustomersFilterSuccess,
  onLoadCustomersSearchSuccess,
  onLoadMedReByCustomerCodeSuccess,

} from '../actions/customer.action';
import { CustomerService } from '../services/customer.service';
import { hiddenProgress } from '../actions/progress.action';
import { showNotify } from '../actions/notify.action';
import { RootState } from '../entities/state.entity';
import Customer from '../../../../../at-common/model/Customer';
import MedicalRecord from '../../../../../at-common/model/MedicalRecord';
import { onCreateMedicalRecord } from '../actions/medicalRecord.action';
import { Router } from '@angular/router';
import { RoomList } from 'src/app/shared/enum/share.enum';
import StoreConstants from '../utils/store.constant';
import CustomerReport from '../../../../../at-common/model/CustomerReport';
import { AuthencationService } from '../services/authentication.service';

@Injectable()
export class CustomerEffect {

  @Effect() loadCustomer$ = this.actions$
    .pipe(
      ofType(CustomerAction.loadCustomers),
      mergeMap(() => fromPromise(this.customerService.loadAllCustomers())
        .pipe(
          mergeMap(value => {
            return [
              loadCustomersSuccess({ customerList: value.entity }),
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
    public onSendNotiPayment$ = this.actions$.pipe(
      ofType(CustomerAction.onSendNotiPayment),
      mergeMap((action: Action & Customer) => fromPromise(this.customerService.onSendNotiPayment(action))
        .pipe(
          mergeMap(value => {
            return [
              showNotify({
                notifyType: 'success', message: 'Nhắc nợ thành công'
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
  onCreateCustomer$ = this.actions$
    .pipe(
      ofType(CustomerAction.onCreateCustomer),
      mergeMap((action: Action & Customer) => fromPromise(this.customerService.onCreateCustomer(action))
        .pipe(
          mergeMap((val: Customer | any) => {
            let medicalRecord: MedicalRecord | any = new MedicalRecord();
            let param: any = action;
            medicalRecord.customerCode = val.entity?.customerCode;
            medicalRecord.serviceType = param.serviceType;
            medicalRecord.currentRoom = param.roomSelected;
            return [
              showNotify({
                notifyType: 'success', message: StoreConstants.CREATE_CUSTOMER_SUCESSFULLY + ' '
                  + `<span class='f-w-700 primary-color'>${val.entity?.fullName}</span>`
              }),
              onCreateMedicalRecord(medicalRecord),
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

  @Effect() onLoadCustomersFilter$ = this.actions$
    .pipe(
      ofType(CustomerAction.onLoadCustomersFilter),
      mergeMap((filter) => fromPromise(this.customerService.onLoadCustomersFilter(filter))
        .pipe(
          mergeMap(result => {
            const data: CustomerReport | CustomerReport[] = result.entity;
            return [
              onLoadCustomersFilterSuccess({ customerFilter: data }),
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

    @Effect() onLoadCustomersSearch$ = this.actions$
    .pipe(
      ofType(CustomerAction.onLoadCustomersSearch),
      mergeMap((filter) => fromPromise(this.customerService.onLoadCustomersSearch(filter))
        .pipe(
          mergeMap(result => {
            const data: CustomerReport | CustomerReport[] = result.entity;
            return [
              onLoadCustomersSearchSuccess({ customerFilter: data }),
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
  public onLoadCustomerById$ = this.actions$.pipe(
    ofType(CustomerAction.onLoadCustomerById),
    mergeMap((action: Action & Customer) => fromPromise(this.customerService.onLoadCustomerById(action))
      .pipe(
        mergeMap(value => {
          return [
            onLoadCustomerByIdSuccess(value.entity),
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
  public onLoadCustomerByCode$ = this.actions$.pipe(
    ofType(CustomerAction.onLoadCustomerByCode),
    mergeMap((action: Action & Customer) => fromPromise(this.customerService.onLoadCustomerByCode(action))
      .pipe(
        mergeMap(value => {
          return [
            onLoadCustomerByCodeSuccess(value.entity),
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
  public onLoadMedReByCustomerCode$ = this.actions$.pipe(
    ofType(CustomerAction.onLoadMedReByCustomerCode),
    mergeMap((action: Action & Customer) => fromPromise(this.customerService.onLoadMedReByCustomerCode(action))
      .pipe(
        mergeMap(value => {
          return [
            onLoadMedReByCustomerCodeSuccess(value.entity),
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
  public onUpdateCustomer$ = this.actions$.pipe(
    ofType(CustomerAction.onUpdateCustomer),
    mergeMap((action: Action & Customer) => fromPromise(this.customerService.onUpdateCustomer(action))
      .pipe(
        mergeMap(value => {
          return [
            showNotify({
              notifyType: 'success', message: StoreConstants.UPDATE_CUSTOMER_SUCESSFULLY + ' '
                + `<span class='f-w-700 primary-color'>${value.entity?.fullName}</span>`
            }),
            onLoadCustomerByIdSuccess(value.entity),
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

  onNavigateToRoom = (room: string): void => {
    switch (room) {
      case RoomList.minorsurgery:
        this.router.navigate(['examine/minorsurgery'])
        break;
      case RoomList.implant:
        this.router.navigate(['examine/implant'])
        break;
      case RoomList.designat:
        this.router.navigate(['examine/designat'])
        break;
      default:
        this.router.navigate(['examine/general']);
    }
  }

  constructor(
    private actions$: Actions,
    private customerService: CustomerService,
    private router: Router
    , private authenService: AuthencationService) {
  }
}
