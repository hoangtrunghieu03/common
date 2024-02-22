import BaseEntity from "../base/BaseEntity";
import ValidationDecorator from "../utilities/validation/ValidationDecorator";
import Constants from "../base/Constants";
import { CHAIR_STATUS } from "./enum";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
import CustomerChair from "./CustomerChair";
/** THÔNG TIN GHẾ NGỒI */
export default class Chair extends BaseEntity<Chair> {
  @ValidationDecorator.required(Constants.NAME_REQUIRE)
  name: string = null;// tên ghế
  description: string = null; // mô tả    
  chairStatus: string = CHAIR_STATUS.AVAILABLE;// trạng thái ghế
  roomId: string = null;// id của phòng
  // @IgnoreDecorator.ignoreInDb()
  staffId: string = null; // Id nhân viên quản lý ghế
  staffName: string = null; // Tên nhân viên quản lý ghế
  medicalRecordId: string = null;// Ho so benh an
  medicalRecordQueue: Array<string> = null;// Danh sách hồ sơ bệnh án đang chờ trong ghế
  customerName: string = null;// Tên bệnh nhân
  @IgnoreDecorator.ignoreInDb()
  count: number = 0;// So ghe dem duoc
  @IgnoreDecorator.ignoreInDb()
  medicalRecord: Array<CustomerChair> = null;// So ghe dem duoc
  constructor() {
    super();
    this.medicalRecordQueue = new Array<string>();
    this.medicalRecord = new Array<CustomerChair>();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.name = obj.hasOwnProperty("name") ? obj.name : this.name;
    this.description = obj.hasOwnProperty("description") ? obj.description : this.description;
    this.chairStatus = obj.hasOwnProperty("chairStatus") ? obj.chairStatus : this.chairStatus;
    this.roomId = obj.hasOwnProperty("roomId") ? obj.roomId : this.roomId;
    this.staffId = obj.hasOwnProperty("staffId") ? obj.staffId : this.staffId;
    this.staffName = obj.hasOwnProperty("staffName") ? obj.staffName : this.staffName;
    this.medicalRecordId = obj.hasOwnProperty("medicalRecordId") ? obj.medicalRecordId : this.medicalRecordId;
    this.customerName = obj.hasOwnProperty("customerName") ? obj.customerName : this.customerName;
    this.medicalRecordQueue = obj.hasOwnProperty("medicalRecordQueue") ? obj.medicalRecordQueue : this.medicalRecordQueue;
    this.count = obj.hasOwnProperty("count") ? obj.count : this.count;
    this.medicalRecord = obj.hasOwnProperty("medicalRecord") ? obj.medicalRecord : this.medicalRecord;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;

  }
  public static newInstance(): Chair {
    let result = new Chair();
    return result;
  }
}