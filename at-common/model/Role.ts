import BaseEntity from "../base/BaseEntity";
import ValidationDecorator from "../utilities/validation/ValidationDecorator";
import Constants from "../base/Constants";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
import DataAccess from "./DataAccess";


export default class Role extends BaseEntity<Role> {
  @ValidationDecorator.required(Constants.ROLE.ROLE_REQUIRE)
  roleName: string = null;  
  dataAccessNames: Array<string>=null;    
  @IgnoreDecorator.ignoreInDb()    
  dataAccesses: Array<DataAccess>; 
  @IgnoreDecorator.ignoreInDb()   
  staffCount: string = null

  constructor() {
    super();   
    this.dataAccessNames = new Array<string>(); 
    this.dataAccesses = new Array<DataAccess>();     
  }

  public assign(obj: any) {
    this._id = obj._id;  
    this.roleName = obj.hasOwnProperty("roleName") ? obj.roleName : this.roleName;    
    this.dataAccessNames = obj.hasOwnProperty("dataAccessNames") ? obj.dataAccessNames : this.dataAccessNames;  
    this.dataAccesses = obj.hasOwnProperty("dataAccesses") ? obj.dataAccesses : this.dataAccesses;      
    this.staffCount = obj.hasOwnProperty("staffCount") ? obj.staffCount : this.staffCount;      
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;
    
  }
  public static newInstance(): Role {
    let result = new Role();
    return result;
  }
}