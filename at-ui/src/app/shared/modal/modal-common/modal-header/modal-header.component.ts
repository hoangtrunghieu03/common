import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'at-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss']
})
export class ModalHeaderComponent implements OnInit {

  @Output() onClose = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onCloseModal = ():void => {
    this.onClose.emit(true)
  }

}
