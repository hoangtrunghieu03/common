import BaseEntity from "../base/BaseEntity";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
import { NOTIFICATION_ACTION } from "./enum";
/** THÔNG BÁO */
export default class Notification extends BaseEntity<Notification> {
  medicalRecordId: string = null;// mã hồ sơ
  customerCode: string = null;
  action: string = NOTIFICATION_ACTION.TRANFER_ROOM;// hành động
  dataAccessNames: Array<string> = null;// id quyền truy cập    
  content: string = null;// nội dung
  scheduleId: string = null;// id của lịch hẹn
  staffIds: Array<string> = null;// nhân viên thấy message
  fromStaffId: string = null;// message được gửi từ nhân viên nào
  roomId: string = null;// id phòng ban 
  chairStatus: string = null;// id phòng ban 
  markRead: boolean = false;// đã đọc
  fromRoomName: string = null;// Ten phong chuyen di
  fromRoomId: string = null;// ID phong chuyen di
  @IgnoreDecorator.ignoreInDb()
  roomName: string = null;
  @IgnoreDecorator.ignoreInDb()
  customerName: string = null;
  constructor() {
    super();
    this.dataAccessNames = new Array<string>();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.medicalRecordId = obj.hasOwnProperty("medicalRecordId") ? obj.medicalRecordId : this.medicalRecordId;
    this.action = obj.hasOwnProperty("action") ? obj.action : this.action;
    this.dataAccessNames = obj.hasOwnProperty("dataAccessNames") ? obj.dataAccessNames : this.dataAccessNames;
    this.content = obj.hasOwnProperty("content") ? obj.content : this.content;
    this.scheduleId = obj.hasOwnProperty("scheduleId") ? obj.scheduleId : this.scheduleId;
    this.staffIds = obj.hasOwnProperty("staffIds") ? obj.staffIds : this.staffIds;
    this.markRead = obj.hasOwnProperty("markRead") ? obj.markRead : this.markRead;
    this.roomId = obj.hasOwnProperty("roomId") ? obj.roomId : this.roomId;
    this.roomName = obj.hasOwnProperty("roomName") ? obj.roomName : this.roomName;
    this.fromRoomName = obj.hasOwnProperty("fromRoomName") ? obj.fromRoomName : this.fromRoomName;
    this.fromRoomId = obj.hasOwnProperty("fromRoomId") ? obj.fromRoomId : this.fromRoomId;
    this.customerName = obj.hasOwnProperty("customerName") ? obj.customerName : this.customerName;
    this.customerCode = obj.hasOwnProperty("customerCode") ? obj.customerCode : this.customerCode;
    this.chairStatus = obj.hasOwnProperty("chairStatus") ? obj.chairStatus : this.chairStatus;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;
    this.fromStaffId = obj.hasOwnProperty("fromStaffId") ? obj.fromStaffId : this.fromStaffId;
  }

  public static newInstance(): Notification {
    let result = new Notification();
    return result;
  }
}