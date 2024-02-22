import BaseEntity from "../base/BaseEntity";
import MedicalServiceCriterial from "./MedicalServiceCriterial";
export default class MedicalServiceIndicateReport extends BaseEntity<MedicalServiceIndicateReport> {   
    filter:MedicalServiceCriterial = null; 
    constructor() {
      super();    
    }

    public assign(obj: any) {
      this._id = obj._id;      
      this.filter = obj.hasOwnProperty("filter") ? obj.filter : this.filter; 
    }
    public static newInstance(): MedicalServiceIndicateReport {
      let result = new MedicalServiceIndicateReport();
      return result;
    }
}