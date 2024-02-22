import BaseEntity from "../base/BaseEntity";
/** Group Dịch vụ  */
export default class MedicalServiceGroup extends BaseEntity<MedicalServiceGroup> {
  name: string = null;// tên nhóm dịch vụ    
  description: string = null; // mô tả    
  orderDisplay:number = 1;
  constructor() {
    super();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.name = obj.hasOwnProperty("name") ? obj.name : this.name;
    this.description = obj.hasOwnProperty("description") ? obj.description : this.description;
    this.orderDisplay = obj.hasOwnProperty("orderDisplay") ? obj.orderDisplay : this.orderDisplay;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;

  }
  public static newInstance(): MedicalServiceGroup {
    let result = new MedicalServiceGroup();
    return result;
  }
}