import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

import {
  RoomsAction,
  onLoadRoomsSuccess,
 
} from '../actions/rooms.action';
import { hiddenProgress } from '../actions/progress.action';
import { showNotify } from '../actions/notify.action';
import { RootState } from '../entities/state.entity';
import { RoomsService } from '../services/rooms.service';
import { AuthencationService } from '../services/authentication.service';

@Injectable()
export class RoomsEffect {

    @Effect()
    onLoadRooms$ = this.actions$
    .pipe(
        ofType(RoomsAction.onLoadRooms),
        mergeMap(() => fromPromise(this.roomsService.onLoadRooms())
            .pipe(
                mergeMap( result => {
                    return [
                        onLoadRoomsSuccess({rooms: result.entity})
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
     private roomsService: RoomsService, 
     private store: Store<RootState>,
      private authenService: AuthencationService) {
  }
}
