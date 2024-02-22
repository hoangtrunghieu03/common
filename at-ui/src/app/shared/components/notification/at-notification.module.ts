import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AtFeatherIconModule } from '../feather-icons/feather-icons.module';
import { ATDirectivesModule } from '../../directives/directives.module';
import { DestroySubsribeService } from '../../service/destroySubscribe.service';
import { AtTableSumaryModule } from '../at-table-sumary/at-table-sumary.module';
import { NotificationComponent } from './notification.component';

@NgModule({
  declarations: [
    NotificationComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AtFeatherIconModule,
    ATDirectivesModule,
    AtTableSumaryModule,
  ],
  providers: [
    DestroySubsribeService,
    DatePipe,
  ],
  exports: [
    NotificationComponent
  ]
})
export class AtNotificationModule { }