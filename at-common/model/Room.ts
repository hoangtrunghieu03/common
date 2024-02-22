import BaseEntity from "../base/BaseEntity";
import ValidationDecorator from "../utilities/validation/ValidationDecorator";
import Constants from "../base/Constants";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
/** Thông tin phòng bệnh*/
export default class Room extends BaseEntity<Room> {      
    @ValidationDecorator.required(Constants.NAME_REQUIRE)   
    name: string=null;// tên phòng    
    description:string =null; // mô tả 
    @IgnoreDecorator.ignoreInDb()
    customerCurrent: number = null;//Số người khám trong phòng
    constructor() {
      super();              
    }

    public assign(obj: any) {
      this._id = obj._id;      
      this.name = obj.hasOwnProperty("name") ? obj.name : this.name;        
      this.description = obj.hasOwnProperty("description") ? obj.description : this.description;       
      this.customerCurrent = obj.hasOwnProperty("customerCurrent") ? obj.customerCurrent : this.customerCurrent;       
      this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;  
      this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;  
      this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;  
      this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime; 
     
    }
    public static newInstance(): Room {
      let result = new Room();
      return result;
    }
}