import BaseEntity from "../base/BaseEntity";
import MedicalScheduleCriterial from "./MedicalScheduleCriterial";
export default class MedicalScheduleReport extends BaseEntity<MedicalScheduleReport> {   
    filter:MedicalScheduleCriterial = null; 
    constructor() {
      super();    
    }

    public assign(obj: any) {
      this._id = obj._id;      
      this.filter = obj.hasOwnProperty("filter") ? obj.filter : this.filter; 
    }
    public static newInstance(): MedicalScheduleReport {
      let result = new MedicalScheduleReport();
      return result;
    }
}