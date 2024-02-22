import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { onCreateMedicalRecordOther } from 'src/app/store/actions/medicalRecord.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { ROOM_STATUS } from '../../../../../../at-common/model/enum';
import MedicalRecord from '../../../../../../at-common/model/MedicalRecord';
import { RoomInfo } from '../../data/at.model';
import { RoomList } from '../../enum/share.enum';
import { MedicalRecordEffect } from '../../../store/effects/medicalRecord.effect';
import { showNotify } from 'src/app/store/actions/notify.action';

@Component({
  selector: 'app-transfer-room-modal',
  templateUrl: './transfer-room-modal.component.html',
  styleUrls: ['./transfer-room-modal.component.scss'],
})
export class TransferRoomModalComponent implements OnInit {

  @Input() content: string;
  @Input() medicalRecord: MedicalRecord;
  @Input() roomInfo: RoomInfo;

  roomStatusList: Array<any> = [];
  roomList = RoomList;
  roomStatus = ROOM_STATUS;
  statusSelected: string = null;

  isCreateMedicalRecord: boolean = false;

  constructor(
    public activeModal: NgbActiveModal,
    private store: Store<RootState>,
    private medicalRecordEffect: MedicalRecordEffect
  ) { }

  ngOnInit(): void {
    this.roomStatusList = Object.values(ROOM_STATUS).map(item => ({label: item, value: item}));
  }

  onShowCheckbox = () => {
    if (!this.medicalRecord.serviceType || this.medicalRecord.serviceType == this.roomInfo.toRoomName) return false;
    if (this.roomInfo.toRoomName == RoomList.general || this.roomInfo.toRoomName == RoomList.braces ||
      this.roomInfo.toRoomName == RoomList.implant) return true;
  }

  onSaveModal = () => {
    if(this.roomInfo.toRoomName == this.roomList.reception && this.roomInfo.roomStatus === null) return this.store.dispatch(showNotify({ notifyType: 'error', message: 'Vui lòng chọn trạng thái!' }));
    this.isCreateMedicalRecord && this.onCreateMedicalRecord();
    this.activeModal.close(!this.isCreateMedicalRecord ? this.roomInfo : null);
  }

  onCreateMedicalRecord = () => {
    let receiver: any = {
      medicalRecordId: this.medicalRecord._id,
      customerCode: this.medicalRecord.customerCode,
      fromRoom: this.roomInfo.fromRoom,
      currentRoom: this.roomInfo.toRoom,
      serviceType: this.roomInfo.toRoomName,
      serviceRequest: this.roomInfo.toRoomName,
      images: this.medicalRecord.images,
      medicalRecordCommitment: this.medicalRecord.medicalRecordCommitment
    };
    this.medicalRecordEffect.handleNavigateRoom(this.roomInfo.roomName);
    this.store.dispatch(onCreateMedicalRecordOther(receiver));
  }

}
