import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {  mergeMap, catchError } from 'rxjs/operators';
import { showNotify } from '../actions/notify.action';
import { hiddenProgress, hiddenProgressSuccess, ProgressAction } from '../actions/progress.action';
import { ProgressBarService } from '../../shared/service/progress-bar.service';
import { fromPromise } from 'rxjs/internal-compatibility';
import { of } from 'rxjs';
@Injectable()
export class ProgressEffect {
    @Effect()
    public showProgress$ = this.actions$.pipe(
        ofType(ProgressAction.showProgress),
        mergeMap(() => fromPromise(this.ProgressBarService.isLoading(true)).pipe(
            mergeMap(value => {
                return [
                                            
                ];
            }),
            catchError(err => of( showNotify({
              notifyType: 'error',
              message: err.message
              }), hiddenProgress()))
            )
        )        
    );  
    @Effect()
    public hiddenProgress$ = this.actions$.pipe(
        ofType(ProgressAction.hiddenProgress),
        mergeMap(() => fromPromise(this.ProgressBarService.isLoading(false)).pipe(
            mergeMap(value => {
                return [
                    hiddenProgressSuccess()                    
                ];
            }),
            catchError(err => of( showNotify({
              notifyType: 'error',
              message: err.message
              }), hiddenProgress()))
            )
        )       
    );  
    constructor(private actions$: Actions, private ProgressBarService: ProgressBarService) {
    }
}
