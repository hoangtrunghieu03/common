import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RoomList } from 'src/app/shared/enum/share.enum';
import { onLoadRooms } from 'src/app/store/actions/rooms.action';
import { RootState } from 'src/app/store/entities/state.entity';
import Room from '../../../../../../../at-common/model/Room';

@Component({
  selector: 'at-examina-footer',
  templateUrl: './examine-footer.component.html',
  styleUrls: ['./examine-footer.component.scss']
})
export class ExaminaFooterComponent implements OnInit {

  @Input() _isComplete: boolean;
  @Input() _isPayment: boolean;
  @Input() currentRoom: string;
  rooms: {label: string, value: string}[] = [];
  examineForm: FormGroup;
  @Output() _onEmitFooterEvent: EventEmitter<any> = new EventEmitter();
  @Output() eventCancel = new EventEmitter();
  subject = new Subject();

  constructor(
    private _formBuilder: FormBuilder,
    private store: Store<RootState>,
  ) { }

  ngOnInit(): void {
    this.examineForm = this.createGeneralForm();
    !this._isComplete && this.onLoadRooms();
  }

  onLoadRooms = ():void => {
    this.store.dispatch(onLoadRooms());
    this.store.select( state => state.room.rooms )
    .pipe(takeUntil(this.subject))
    .subscribe( room => room &&
      (this.rooms = room.filter(val => val.name?.toLowerCase() != this.currentRoom?.toLowerCase())
                        .map((item) => ({label: item.name, value: item._id}))))
  }

  createGeneralForm = ():FormGroup => {
    return this._formBuilder.group({
      roomList: [null]
    });
  }

  onSaveAndRouter = ():void => {

  }

  getValueSelected = (event):void => {

  }

  onCanCel = ():void => {
    this.eventCancel.emit()
  }

  getRoomName = ():string => {
    return this.rooms.find(room => room.value === this.examineForm.get('roomList').value)?.label
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
}
