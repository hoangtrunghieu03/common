import BaseEntity from "../base/BaseEntity";
import StaffCriterial from "./StaffCriterial";
import StaffData from "./StaffData";
export default class StaffReport extends BaseEntity<StaffReport> {   
    filter:StaffCriterial = null; 
    datas: Array<StaffData>
    constructor() {
      super();    
      this.datas = new Array<StaffData>();
    }

    public assign(obj: any) {
      this._id = obj._id;      
      this.filter = obj.hasOwnProperty("filter") ? obj.filter : this.filter; 
      this.datas = obj.hasOwnProperty("datas") ? obj.datas : this.datas; 
    }
    public static newInstance(): StaffReport {
      let result = new StaffReport();
      return result;
    }
}