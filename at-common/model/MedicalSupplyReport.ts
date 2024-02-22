import BaseEntity from "../base/BaseEntity";
import MedicalSupplyCriterial from "./MedicalSupplyCriterial";
export default class MedicalSupplyReport extends BaseEntity<MedicalSupplyReport> {   
    filter:MedicalSupplyCriterial = null; 
    constructor() {
      super();    
    }

    public assign(obj: any) {
      this._id = obj._id;      
      this.filter = obj.hasOwnProperty("filter") ? obj.filter : this.filter; 
    }
    public static newInstance(): MedicalSupplyReport {
      let result = new MedicalSupplyReport();
      return result;
    }
}