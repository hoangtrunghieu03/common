import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ConfirmModalComponent } from '../modal/confirm-modal/confirm-modal.component';
import { ProgressBarService } from '../service/progress-bar.service';

export interface ComponentCanDeactivate {
  canDeactivate(): boolean | Observable<boolean>;
}

export const CanDeactivateState = {
  defendAgainstBrowserBackButton: false,
};

@Injectable()
export class CanDeactivateGuard implements CanDeactivate<ComponentCanDeactivate> {

  constructor(
    private model: NgbModal,
    private progressbarService: ProgressBarService
  ) {
  }

  canDeactivate(component: ComponentCanDeactivate): boolean | Observable<boolean> | any{
    this.progressbarService.isLoading(false);
    return component.canDeactivate() || this.model.open(ConfirmModalComponent, {
      size: 'md',
      backdrop: 'static',
      centered: true
    }).result.then(result => {
      if (!result && CanDeactivateState.defendAgainstBrowserBackButton) {
        history.pushState(null, '', '');
      }
      return result;
    }).catch( error => console.log(error))
  }
}
