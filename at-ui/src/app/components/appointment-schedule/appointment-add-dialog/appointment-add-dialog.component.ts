import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-appointment-add-dialog',
  templateUrl: './appointment-add-dialog.component.html',
  styleUrls: ['./appointment-add-dialog.component.scss']
})
export class AppointmentAddDialogComponent implements OnInit {

  appointmentForm: FormGroup;
  customers = CUSTOMERS

  constructor(
    public activeModal: NgbActiveModal,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.appointmentForm = this.createAppointmentForm();
  }

  createAppointmentForm = ():FormGroup => {
    return this._formBuilder.group({
      customerName: [null],
      tel: [null],
      address: [null],
      birthday: [null],
      sex: ['Nữ'],
      scheduleTime: [null],
      content: [null],
      status: [null],
      note: [null]
    })
  }

  onSelectItem = (event):void => {
    this.appointmentForm.get('customerName').setValue(event.value)
  }

  onSaveForm = ():void => {
    this.activeModal.close(this.appointmentForm.value)
  }

}

const CUSTOMERS = [
  {label: 'Lê Ngọc Tuấn', value: 'Lê Ngọc Tuấn'},
  {label: 'Nguyễn Văn Linh', value: 'Nguyễn Văn Linh'},
]
