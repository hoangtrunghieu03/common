import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { showNotify } from 'src/app/store/actions/notify.action';
import { showProgress } from 'src/app/store/actions/progress.action';
import { onAuthZalo } from 'src/app/store/actions/zalo.action';
import { RootState } from 'src/app/store/entities/state.entity';

@Component({
  selector: 'app-auth-zalo',
  templateUrl: './auth-zalo.component.html',
  styleUrls: ['./auth-zalo.component.scss']
})
export class AuthZaloComponent implements OnInit {

  constructor(
    private store: Store<RootState>,
    private route: ActivatedRoute,
    private destroy: DestroySubsribeService,
    public location: Location,
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(param => {
      if ( param && param.code && param.oa_id) {
        const data = {oa_id: param.oa_id, code: param.code};
        this.store.dispatch(onAuthZalo(data));
      }else{
        this.location.back();
      }
    })
  }

}
