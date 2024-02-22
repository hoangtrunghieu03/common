import BaseEntity from "../base/BaseEntity";
import CustomerCriterial from "./CustomerCriterial";
import CustomerReportCurrent from "./CustomerReportCurrent";
export default class CustomerReport extends BaseEntity<CustomerReport> {   
    filter:CustomerCriterial = null; 
    reports:Array<CustomerReportCurrent>;
    constructor() {
      super();    
      this.reports = new Array<CustomerReportCurrent>();
    }

    public assign(obj: any) {
      this._id = obj._id;      
      this.filter = obj.hasOwnProperty("filter") ? obj.filter : this.filter; 
      this.reports = obj.hasOwnProperty("reports") ? obj.reports : this.reports; 
    }
    public static newInstance(): CustomerReport {
      let result = new CustomerReport();
      return result;
    }
}