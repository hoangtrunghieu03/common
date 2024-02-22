import BaseEntity from "../base/BaseEntity";
import ValidationDecorator from "../utilities/validation/ValidationDecorator";
import Constants from "../base/Constants";
/**THÔNG TIN QUYỀN ĐƯỢC TRUY CẬP */
export default class DataAccess extends BaseEntity<DataAccess> {
  @ValidationDecorator.required(Constants.ROLE.DATACCESS_REQUIRE)
  dataAccessName: string = null;
  group:string = null;
  groupOrder:number = 1;
  createByUserId: string = null;
  updateByUserId: string = null;
  createDateTime: Date = null;
  updateDateTime: Date = null;
  constructor() {
    super();   
  }

  public assign(obj: any) {
    this._id = obj._id;    
    this.dataAccessName = obj.hasOwnProperty("dataAccessName") ? obj.dataAccessName : this.dataAccessName;
    this.group = obj.hasOwnProperty("group") ? obj.group : this.group;
    this.groupOrder = obj.hasOwnProperty("groupOrder") ? obj.groupOrder : this.groupOrder;   
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;
    
  }
  public static newInstance(): DataAccess {
    let result = new DataAccess();
    return result;
  }
}