let Promise = require('promise');
import BaseHelper from "../../base/BaseHelper";
import Constants from "../../base/Constants";
import Staffs from "../Staffs";
import MedicalRecordReport from "../MedicalRecordReport";
export default class MedicalRecordReportManager extends BaseHelper<MedicalRecordReport>{
    constructor(user: Staffs) {
        super(user);
        this.classInfo.mongoCollectionName = "MedicalRecord";
        this.classInfo.type = MedicalRecordReport;
        this.classInfo.nameSpace = "fwg.dentistry.common";
        this.classInfo.dbType = Constants.DB_TYPES.MONGO;
        this.classInfo.cacheType = Constants.CACHE_REDIS;
        this.classInfo.endPoint = "medicalRecord";
    }

    public createObject(data): Promise<MedicalRecordReport> {
        let promise = new Promise((resolve, reject) => {
            let obj = new MedicalRecordReport();
            this.assignObject(obj, data);
            resolve(obj);
        });
        return promise;
    }
    public assignObject(obj: MedicalRecordReport, data: any) {
        obj._id = data._id;
        obj.filter = data.filter;
        obj.reports = data.reports;
        obj.datas = data.datas;
    }

    public newInstance() {
        return new MedicalRecordReport();
    }
}