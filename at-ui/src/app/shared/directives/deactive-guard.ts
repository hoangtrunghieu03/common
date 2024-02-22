import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { hiddenProgress } from '../../store/actions/progress.action';
import { ConfirmModalComponent } from '../modal/confirm-modal/confirm-modal.component';
import { RootState } from '../../store/entities/state.entity';

@Injectable()
export default class DeactivateGuard implements CanDeactivate<undefined> {
  public canChange: boolean = true;

  constructor(
    private store: Store<RootState>,
    private modal: NgbModal,
    private _router: Router
  ) {
  }

  canDeactivate(component: undefined,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot) {
    // if (!this.canChange) {
    //   this.store.dispatch(hiddenProgress());
    //   this.onConfirmChangeScreen(nextState.url);
    //   return false;
    // }

    return true;
  }

  setCanDeactivate(can: boolean) {
    this.canChange = can;
  }

  onConfirmChangeScreen = (nextUrl: string) => {
    const modal: NgbModalRef = this.modal.open(ConfirmModalComponent, {
      centered: true,
      size: 'md'
    })
    modal.componentInstance.title = 'Xác nhận';
    modal.componentInstance.content = `Bạn chưa lưu thay đổi. Bạn có muốn hủy toàn bộ ?`;
    modal.result.then(result => {
      if (!result) { return }
      this.setCanDeactivate(true);
      this._router.navigate([nextUrl]);
    }).catch(error => {
    })
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.canChange = true;
  }

}