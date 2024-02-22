import BaseEntity from "../base/BaseEntity";
import ValidationDecorator from "../utilities/validation/ValidationDecorator";
import Constants from "../base/Constants";
/**THÔNG TIN TRANG THIẾT BỊ */
export default class MedicalEquipment extends BaseEntity<MedicalEquipment> {
  @ValidationDecorator.required(Constants.NAME_REQUIRE)
  name: string = null;// tên trang thiết bị
  price: number = null;// giá
  quantity: number = null; // số lượng
  unit: string = null;// đơn vị
  origin: string = null;//xuất xứ
  description: string = null; // mô tả  
  constructor() {
    super();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.name = obj.hasOwnProperty("name") ? obj.name : this.name;
    this.price = obj.hasOwnProperty("price") ? obj.price : this.price;
    this.quantity = obj.hasOwnProperty("quantity") ? obj.quantity : this.quantity;  
    this.unit = obj.hasOwnProperty("unit") ? obj.unit : this.unit;
    this.origin = obj.hasOwnProperty("origin") ? obj.origin : this.origin;
    this.description = obj.hasOwnProperty("description") ? obj.description : this.description; 
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;

  }
  public static newInstance(): MedicalEquipment {
    let result = new MedicalEquipment();
    return result;
  }
}