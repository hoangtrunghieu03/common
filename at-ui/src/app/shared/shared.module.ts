import { WebSocketService } from './service/web-socket.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ContentLayoutComponent } from './layout/content-layout/content-layout.component';
import { NavService } from './service/nav.service';
import { WINDOW_PROVIDERS } from './service/windows.service';
import { ProgressBarService } from './service/progress-bar.service';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { RightSidebarComponent } from './components/right-sidebar/right-sidebar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CKEditorModule } from 'ngx-ckeditor';
import { RoleService } from './service/setting.service';
import { AppointmentScheduleService } from './service/appointment-schedule.service';
import { CanDeactivateGuard } from "./routes/can-deactivate.guard";
import { AtFeatherIconModule } from "./components/feather-icons/feather-icons.module";
import { ProgressBarModule } from './components/progress-bar/progress-bar.module';
import { ConfirmModalComponent } from './modal/confirm-modal/confirm-modal.component';
import { TransferRoomModalComponent } from './modal/transfer-room-modal/transfer-room-modal.component';
import { AtNotificationModule } from './components/notification/at-notification.module'
import { PreviewImgModalComponent } from './modal/preview-img-modal/preview-img-modal.component';
@NgModule({
  declarations: [
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    ContentLayoutComponent,
    BreadcrumbComponent,
    RightSidebarComponent,
    ConfirmModalComponent,
    TransferRoomModalComponent,
    PreviewImgModalComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    CKEditorModule,
    AtFeatherIconModule,
    ProgressBarModule,
    AtNotificationModule
  ],
  providers: [
    NavService,
    WINDOW_PROVIDERS,
    CurrencyPipe,
    DecimalPipe,
    WebSocketService,
    ProgressBarService,
    RoleService,
    AppointmentScheduleService,
    CanDeactivateGuard
  ],
  exports: [
    ConfirmModalComponent
  ],
  entryComponents: [],
})
export class SharedModule {}
