import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
import { catchError, mergeMap } from 'rxjs/operators';

import ServiceRequest from '../../../../../at-common/model/ServiceRequest';
import { showNotify } from '../actions/notify.action';
import { hiddenProgress } from '../actions/progress.action';
import { onLoadServiceRequest, onLoadServiceRequestSuccess, ServiceRequestAction, onLoadServiceRequestFilterSuccess, onLoadServiceRequestFilter } from '../actions/serviceRequest.action';
import { AuthencationService } from '../services/authentication.service';
import { ServiceRequestService } from '../services/serviceRequest.service';

@Injectable()
export class ServiceRequestEffect {

    @Effect()
    onLoadServiceRequest$ = this.actions$
        .pipe(
            ofType(ServiceRequestAction.onLoadServiceRequest),
            mergeMap(() => fromPromise(this.serviceRequestService.onLoadServiceRequest())
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadServiceRequestSuccess({ serviceRequest: result.entity }),
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
    onLoadServiceRequestFilter$ = this.actions$
        .pipe(
            ofType(ServiceRequestAction.onLoadServiceRequestFilter),
            mergeMap((action: Action & { typeServiceRequest: string }) => fromPromise(this.serviceRequestService.onLoadServiceRequestFilter(action))
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadServiceRequestFilterSuccess({ serviceRequest: result.entity }),
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
    onCreateServiceRequest$ = this.actions$
        .pipe(
            ofType(ServiceRequestAction.onCreateServiceRequest),
            mergeMap((action: Action & ServiceRequest) => fromPromise(this.serviceRequestService.onCreateServiceRequest(action))
                .pipe(
                    mergeMap(result => {
                        return [
                            onLoadServiceRequestFilter({ typeServiceRequest: action.typeServiceRequest }),
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
        private serviceRequestService: ServiceRequestService,
        private authenService: AuthencationService) {
    }
}