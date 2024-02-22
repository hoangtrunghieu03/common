import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { CKEditorModule } from 'ngx-ckeditor';
import { ModalHeaderComponent } from "./modal-header/modal-header.component";
import { ModalFooterComponent } from "./modal-footer/modal-footer.component";
@NgModule({
  declarations: [
    ModalHeaderComponent,
    ModalFooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgxDatatableModule,
    CKEditorModule,
  ],
  providers: [
  ],
  exports: [
    ModalHeaderComponent,
    ModalFooterComponent
  ],
  entryComponents: [],
})
export class ATModalModule {}
