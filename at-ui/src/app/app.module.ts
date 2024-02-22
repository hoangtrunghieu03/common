import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import localeVi from '@angular/common/locales/vi';
import { registerLocaleData } from '@angular/common';
import { AppStoreModule } from './store/app.store.module';
import { ExcelService } from "./shared/service/excel.service";
import { PrintService } from './shared/service/print.service';
import { UploadImageService } from './store/services/uploadImages.service';
import { AuthModule } from './components/auth/auth.module';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { DashboardModule } from './components/dashboard/dashboard.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommitmentModule } from './components/commitment/commitment.module';
import { AtGeneralContentPrintModule } from './shared/components/general-content-print/at-general-content-print.module';

registerLocaleData(localeVi, 'vi-VN');

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    AppStoreModule,
    SharedModule,
    DashboardModule,
    FormsModule,
    ReactiveFormsModule,
    AtGeneralContentPrintModule,
    CommitmentModule,
    AuthModule
  ],
  providers: [ExcelService, PrintService, UploadImageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
