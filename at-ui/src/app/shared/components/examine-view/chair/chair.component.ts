import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { takeUntil } from 'rxjs/operators';
import { hiddenModal } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadChair } from 'src/app/store/actions/chair.action';
import { onMedicalCustomerChair } from 'src/app/store/actions/medicalRecord.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { CHAIR_STATUS } from '../../../../../../../at-common/model/enum';
import Staffs from '../../../../../../../at-common/model/Staffs';
import { RootState } from '../../../../store/entities/state.entity';

@Component({
  selector: 'at-chair',
  templateUrl: './chair.component.html',
  styleUrls: ['./chair.component.scss'],
  providers: [DestroySubsribeService, DatePipe]
})
export class ChairComponent implements OnInit {

  @Input() medicalRecord: string;
  @Input() _view: boolean = false;
  constructor(
    public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

}