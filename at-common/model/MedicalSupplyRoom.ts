import BaseEntity from "../base/BaseEntity";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
import MedicalSupplyInfo from "./MedicalSupplyInfo";

/**THÔNG TIN VẬT T */
export default class MedicalSupplyRoom extends BaseEntity<MedicalSupplyRoom> {
  medicalSupplyId: string = null; // id vật tư
  medicalSupplyName: string = null; // Ten vat tu
  medicalSupplyName_en: string = null; // Ten vat tu
  medicalSupplyUnit: string = null; // Don vi vat tu
  medicalSupplyInputId: string = null; // id vật tư lô hàng
  roomId: string = null;// id phòng
  quantityRemain: number = null;// Số lượng còn lại thực tế trong phòng
  @IgnoreDecorator.ignoreInDb()
  listSupply: Array<MedicalSupplyInfo> = null; //Danh sách vật tư
  constructor() {
    super();
    this.listSupply = new Array<MedicalSupplyInfo>()
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.medicalSupplyId = obj.hasOwnProperty("medicalSupplyId") ? obj.medicalSupplyId : this.medicalSupplyId;
    this.medicalSupplyName = obj.hasOwnProperty("medicalSupplyName") ? obj.medicalSupplyName : this.medicalSupplyName;
    this.medicalSupplyName_en = obj.hasOwnProperty("medicalSupplyName_en") ? obj.medicalSupplyName_en : this.medicalSupplyName_en;
    this.medicalSupplyUnit = obj.hasOwnProperty("medicalSupplyUnit") ? obj.medicalSupplyUnit : this.medicalSupplyUnit;
    this.medicalSupplyInputId = obj.hasOwnProperty("medicalSupplyInputId") ? obj.medicalSupplyInputId : this.medicalSupplyInputId;
    this.roomId = obj.hasOwnProperty("roomId") ? obj.roomId : this.roomId;
    this.listSupply = obj.hasOwnProperty("listSupply") ? obj.listSupply : this.listSupply;
    this.quantityRemain = obj.hasOwnProperty("quantityRemain") ? obj.quantityRemain : this.quantityRemain;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;  

  }
  public static newInstance(): MedicalSupplyRoom {
    let result = new MedicalSupplyRoom();
    return result;
  }
}