import { Component, OnInit } from '@angular/core';
import Customer from '../../../../../../at-common/model/Customer';
import MedicalSchedule from '../../../../../../at-common/model/MedicalSchedule';
import Staffs from '../../../../../../at-common/model/Staffs';
import { ActivatedRoute } from '@angular/router';
import { RootState } from 'src/app/store/entities/state.entity';
import { Store } from '@ngrx/store';
import { onLoadMedicalScheduleById, onLoadMedicalScheduleCustomerQR } from 'src/app/store/actions/medicalSchedule.action';
import { takeUntil } from 'rxjs/operators';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadCustomerByCode } from 'src/app/store/actions/customer.action';
import { showProgress } from 'src/app/store/actions/progress.action';

@Component({
  selector: 'app-appointment-schedule-qr',
  templateUrl: './appointment-schedule-qr.component.html',
  styleUrls: ['./appointment-schedule-qr.component.scss']
})
export class AppointmentScheduleQRComponent implements OnInit {

  constructor(private router: ActivatedRoute,  private store: Store<RootState>, private destroyService: DestroySubsribeService,) { }
  customer: Customer;
  isLoading: boolean = false;
  medicalSchedule: MedicalSchedule;
  ngOnInit(): void {
    this.router.queryParams.subscribe(param => {
      if ( param && param._id ) {
        this.onLoadMedicalSchedule(param._id);
      }
    })
    this.store.select(state => state.progress.show)
    .pipe(takeUntil(this.destroyService.destroySub$))
    .subscribe(show => {
      setTimeout(() => {
        this.isLoading = !show;
      }, 200);
    })
  }
  onLoadMedicalSchedule = (customerCode) => {
    this.store.dispatch(onLoadMedicalScheduleCustomerQR({customerCode: customerCode}));
    this.store.select(state => state.medicalSchedule.medicalSchedule)
      .pipe(takeUntil(this.destroyService.destroySub$))
      .subscribe(medicalSchedule => {
        if (!medicalSchedule) return ;
        this.medicalSchedule = medicalSchedule;
        this.customer = medicalSchedule.customer;
      })
  }

}
