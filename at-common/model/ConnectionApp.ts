import BaseEntity from "../base/BaseEntity";
import ValidationDecorator from "../utilities/validation/ValidationDecorator";
import Constants from "../base/Constants";
export default class ConnectionApp extends BaseEntity<ConnectionApp> {      
    @ValidationDecorator.required(Constants.NAME_REQUIRE)   
    name: string=null;//NT-FAST/ FAST-NT     
    accessToken: string = null;
    userName:string=null;
    url:string=null;       
    createByUserId: string=null;    
    updateByUserId: string=null;    
    createDateTime: Date=null;    
    updateDateTime: Date=null;      
    constructor() {
      super();          
    }

    public assign(obj: any) {
      this._id = obj._id;      
      this.name = obj.hasOwnProperty("name") ? obj.name : this.name;  
      this.accessToken = obj.hasOwnProperty("accessToken") ? obj.accessToken : this.accessToken; 
      this.url = obj.hasOwnProperty("url") ? obj.url : this.url; 
      this.userName = obj.hasOwnProperty("userName") ? obj.userName : this.userName;  
      this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;  
      this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;  
      this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;  
      this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime; 
     
    }
    public static newInstance(): ConnectionApp {
      let result = new ConnectionApp();
      return result;
    }
}