import BaseEntity from "../base/BaseEntity";
import MedicalServiceCriterial from "./MedicalServiceCriterial";
export default class MedicalServiceReport extends BaseEntity<MedicalServiceReport> {   
    filter:MedicalServiceCriterial = null; 
    constructor() {
      super();    
    }

    public assign(obj: any) {
      this._id = obj._id;      
      this.filter = obj.hasOwnProperty("filter") ? obj.filter : this.filter; 
    }
    public static newInstance(): MedicalServiceReport {
      let result = new MedicalServiceReport();
      return result;
    }
}