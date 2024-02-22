import BaseEntity from "../base/BaseEntity";
import MedicalSupplyHistoryCriterial from "./MedicalSupplyHistoryCriterial";
import MedicalSupplyHistoryReportDatas from "./MedicalSupplyHistoryReportDatas";
export default class MedicalSupplyHistoryReport extends BaseEntity<MedicalSupplyHistoryReport> {   
    filter:MedicalSupplyHistoryCriterial = null; 
    datas: Array<MedicalSupplyHistoryReportDatas>
    constructor() {
      super();    
      this.datas = new Array<MedicalSupplyHistoryReportDatas>()
    }

    public assign(obj: any) {
      this._id = obj._id;      
      this.filter = obj.hasOwnProperty("filter") ? obj.filter : this.filter; 
      this.datas = obj.hasOwnProperty("datas") ? obj.datas : this.datas; 
    }
    public static newInstance(): MedicalSupplyHistoryReport {
      let result = new MedicalSupplyHistoryReport();
      return result;
    }
}