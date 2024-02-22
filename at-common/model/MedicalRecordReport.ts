import BaseEntity from "../base/BaseEntity";
import MedicalRecordCriterial from "./MedicalRecordCriterial";
import MedicalRecordData from "./MedicalRecordData";
import MedicalRecordReportCurrent from "./MedicalRecordReportCurrent";

export default class MedicalRecordReport extends BaseEntity<MedicalRecordReport> {
    filter: MedicalRecordCriterial = null; 
    reports:Array<MedicalRecordReportCurrent>;
    datas: Array<MedicalRecordData>;
    constructor() {
        super();
        this.reports = new Array<MedicalRecordReportCurrent>();
        this.datas = new Array<MedicalRecordData>();
    }

    public assign(obj: any) {
        this._id = obj._id;
        this.filter = obj.hasOwnProperty("filter") ? obj.filter : this.filter;
        this.reports = obj.hasOwnProperty("reports") ? obj.reports : this.reports;
        this.datas = obj.hasOwnProperty("datas") ? obj.datas : this.datas;
    }
    public static newInstance(): MedicalRecordReport {
        let result = new MedicalRecordReport();
        return result;
    }
}