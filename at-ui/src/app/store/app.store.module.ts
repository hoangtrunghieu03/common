import { NgModule } from '@angular/core';
import { ActionReducerMap, Store, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RootState } from './entities/state.entity';
import { notifyReducer } from './reducers/notify.reducer'
import { HttpClientModule } from '@angular/common/http';

/*-----customer-----*/
import { customerReducer } from './reducers/customer.reducer';
import { CustomerEffect } from './effects/customer.effect';
import { CustomerService } from './services/customer.service';

/*-----Staff----- */
import { staffReducer } from "./reducers/staffs.reducer";
import { StaffsService } from "./services/staffs.service";
import { StaffEffect } from "./effects/staffs.effect";

/*-----medical equipment----- */
import { MedicalEquipmentEffect } from "./effects/medicalEquipment.effect";
import { medicalEquipmentReducer } from "./reducers/medicalEquipment.reducer";
import { MedicalEquipmentService } from "./services/medicalEquipment.service";

/*-----Progress----- */
import { ProgressEffect } from "./effects/progress.effect"
import { progressReducer } from "./reducers/progress.reducer";

/*-----Authencation----- */
import { AuthencationEffect } from "./effects/authentication.effect"
import { authencationReducer } from "./reducers/authentication.reducer";
import { AuthencationService } from "./services/authentication.service";
import { loadAuthencationInit } from './actions/authentication.action';

/*-----MedicalRecord----- */
import { MedicalRecordEffect } from "./effects/medicalRecord.effect"
import { medicalRecordReducer } from "./reducers/medicalRecord.reducer";
import { MedicalRecordService } from "./services/medicalRecord.service";

/*-----Roles----- */
import { rolesReducer } from "./reducers/roles.reducer";
import { RolesService } from "./services/roles.service";
import { RolesEffect } from "./effects/roles.effect";

/*-----Medical Supply----- */
import { MedicalSupplyEffect } from "./effects/medicalSupply.effect"
import { medicalSupplyReducer } from "./reducers/medicalSupply.reducer";
import { MedicalSupplyService } from "./services/medicalSupply.service";

/*-----Medical Supply----- */
import { MedicalSupplyRequestEffect } from "./effects/medicalSupplyRequest.effect"
import { medicalSupplyRequestReducer } from "./reducers/medicalSupplyRequest.reducer";
import { MedicalSupplyRequestService } from "./services/medicalSupplyRequest.service";

/*-----MedicalSchudule----- */
import { MedicalScheduleEffect } from "./effects/medicalSchedule.effect"
import { medicalScheduleReducer } from "./reducers/medicalSchedule.reducer";
import { MedicalScheduleService } from "./services/medicalSchedule.service";

/*-----Room----- */
import { RoomsEffect } from "./effects/rooms.effect"
import { roomReducer } from "./reducers/rooms.reducer";
import { RoomsService } from "./services/rooms.service";

/*-----medicalServiceGroup----- */
import { MedicalServiceGroupEffect } from "./effects/medicalServiceGroup.effect"
import { medicalServiceGroupReducer } from "./reducers/medicalServiceGroup.reducer";
import { MedicalServiceGroupService } from "./services/medicalServiceGroup.service";

/*-----medicalService----- */
import { MedicalServiceEffect } from "./effects/medicalService.effect"
import { medicalServiceReducer } from "./reducers/medicalService.reducer";
import { MedicalServiceService } from "./services/medicalService.service";

/*-----medicalComboService----- */
import { MedicalComboServiceEffect } from "./effects/medicalComboService.effect"
import { medicalComboServiceReducer } from "./reducers/medicalComboService.reducer";
import { MedicalComboServiceService } from "./services/medicalComboService.service";

/*-----service indicate----- */
import { ServiceIndicateEffect } from "./effects/serviceIndicate.effect"
import { serviceIndicateReducer } from "./reducers/serviceIndicate.reducer";
import { ServiceIndicateService } from "./services/serviceIndicate.service";

/*-----service indicate group----- */
import { ServiceIndicateGroupEffect } from "./effects/serviceIndicateGroup.effect"
import { serviceIndicateGroupReducer } from "./reducers/serviceIndicateGroup.reducer";
import { ServiceIndicateGroupService } from "./services/serviceIndicateGroup.service";

/*-----chair----- */
import { ChairEffect } from "./effects/chair.effect"
import { chairReducer } from "./reducers/chair.reducer";
import { ChairService } from "./services/chair.service";

/*-----notification----- */
import { NotificationEffect } from "./effects/notification.effect"
import { notificationReducer } from "./reducers/notification.reducer";
import { NotificationService } from "./services/notification.service";

/*-----dashboard----- */
import { DashboardEffect } from "./effects/dashboard.effect"
import { dashboardReducer } from "./reducers/dashboard.reducer";
import { DashboardService } from "./services/dashboard.service";

/*-----service request----- */
import { ServiceRequestEffect } from "./effects/serviceRequest.effect"
import { serviceRequestReducer } from "./reducers/serviceRequest.reducer";
import { ServiceRequestService } from "./services/serviceRequest.service";

/*-----dlivery note----- */
import { DeliveryNoteEffect } from "./effects/deliveryNote.effect"
import { deliveryNoteReducer } from "./reducers/deliveryNote.reducer";
import { DeliveryNoteService } from "./services/deliveryNote.service";

/*-----setting----- */
import { SettingEffect } from "./effects/setting.effect"
import { settingReducer } from "./reducers/setting.reducer";
import { SettingService } from "./services/setting.service";

/*-----report----- */
import { ReportEffect } from "./effects/report.effect";
import { reportReducer } from "./reducers/report.reducer";
import { ReportService } from "./services/report.service";
import MedicalEquipment from '../../../../at-common/model/MedicalEquipment';
import { DestroySubsribeService } from '../shared/service/destroySubscribe.service';

import { ZaloEffect } from './effects/zalo.effect';
import { zaloReducer } from "./reducers/zalo.reducer"
import { ZaloService } from './services/zalo.service';
const reducers: ActionReducerMap<RootState> = {
  customer: customerReducer,
  notify: notifyReducer,
  staff: staffReducer,
  progress: progressReducer,
  authencation: authencationReducer,
  medicalRecord: medicalRecordReducer,
  role: rolesReducer,
  medicalSupply: medicalSupplyReducer,
  medicalSupplyRequest: medicalSupplyRequestReducer,
  medicalSchedule: medicalScheduleReducer,
  room: roomReducer,
  medicalServiceGroup: medicalServiceGroupReducer,
  medicalService: medicalServiceReducer,
  medicalComboService: medicalComboServiceReducer,
  serviceIndicate: serviceIndicateReducer,
  serviceIndicateGroup: serviceIndicateGroupReducer,
  chair: chairReducer,
  notification: notificationReducer,
  dashboard: dashboardReducer,
  report: reportReducer,
  medicalEquipment: medicalEquipmentReducer,
  medicalEquipmentList: medicalEquipmentReducer,
  serviceRequest: serviceRequestReducer,
  deliveryNote: deliveryNoteReducer,
  setting: settingReducer,
  zalo: zaloReducer
};

@NgModule({
    imports: [
        StoreModule.forRoot(reducers),
        EffectsModule.forRoot([
          CustomerEffect,
          StaffEffect,
          ProgressEffect,
          AuthencationEffect,
          MedicalRecordEffect,
          RolesEffect,
          MedicalSupplyEffect,
          MedicalSupplyRequestEffect,
          MedicalScheduleEffect,
          RoomsEffect,
          MedicalServiceGroupEffect,
          MedicalServiceEffect,
          ServiceIndicateEffect,
          ServiceIndicateGroupEffect,
          ChairEffect,
          NotificationEffect,
          DashboardEffect,
          ReportEffect,
          MedicalEquipmentEffect,
          ServiceRequestEffect,
          DeliveryNoteEffect,
          MedicalComboServiceEffect,
          SettingEffect,
          ZaloEffect
        ]),
        HttpClientModule
    ],
    exports: [
        StoreModule,
        EffectsModule
    ],
    providers: [
      CustomerService,
      StaffsService,
      AuthencationService,
      MedicalRecordService,
      RolesService,
      MedicalSupplyService,
      MedicalSupplyRequestService,
      MedicalScheduleService,
      RoomsService,
      MedicalServiceGroupService,
      MedicalServiceService,
      ServiceIndicateService,
      ServiceIndicateGroupService,
      ChairService,
      NotificationService,
      DashboardService,
      ReportService,
      MedicalEquipmentService,
      DestroySubsribeService,
      ServiceRequestService,
      DeliveryNoteService,
      MedicalComboServiceService,
      SettingService,
      ZaloService
    ]
})
export class AppStoreModule {
  constructor(private store: Store<RootState>) {
    this.store.dispatch((loadAuthencationInit()));
  }
}
