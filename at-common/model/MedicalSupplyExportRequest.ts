import BaseEntity from "../base/BaseEntity";
import { ADJUST_WAREHORSE_REASON } from "./enum";
import MedicalSupplyInfo from "./MedicalSupplyInfo";
/**THÔNG TIN LỊCH SỬ VẬT TƯ */
export default class MedicalSupplyExportRequest extends BaseEntity<MedicalSupplyExportRequest> {
  staffId: string = null;// Người đề xuất
  roomId: string = null;// Phòng đề xuất
  listSupply: Array<MedicalSupplyInfo> = null; //Danh sách vật tư
  confirmFlag: boolean = null;// Danh sach da duoc dong y xuat hay chua
  constructor() {
    super();
    this.listSupply = new Array<MedicalSupplyInfo>()
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.staffId = obj.staffId;
    this.roomId = obj.roomId;
    this.listSupply = obj.listSupply;
    this.confirmFlag = obj.confirmFlag;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;  

  }
  public static newInstance(): MedicalSupplyExportRequest {
    let result = new MedicalSupplyExportRequest();
    return result;
  }
}