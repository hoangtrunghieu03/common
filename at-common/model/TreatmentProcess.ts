var ObjectID = require('mongodb').ObjectID
import { OPERATOR_SERVICE_STATUS } from "../model/enum"
import MedicalBaseModel from "./MedicalBaseModel";
import MedicalSchedule from "./MedicalSchedule";
import MedicalSupplyTreatment from "./MedicalSupplyTreatment";
export default class TreatmentProcess {
  public id: string = new ObjectID();
  public processDay: Date = null;// ngày thực hiện
  public order: string = null;// thực hiện y lệnh
  public note: string = null;//Ghi chú
  public note_en: string = null;//Ghi chú không co dấu để search
  public staffId: Array<string> = [];//Người thực hiện
  public serviceId: string = null;// Dịch vụ thực hiện
  public serviceIndicateId: Array<string> = null;// Dịch vụ thực hiện
  public treatmentStatus: string = OPERATOR_SERVICE_STATUS.NOT_FINISH;// Trạng thái
  public medicalSupply: Array<MedicalSupplyTreatment> = null;//Vật dụng tiêu hao
  public medicalService: MedicalBaseModel = null;
  public medicalServiceIndicate: Array<MedicalBaseModel> = null;
  public roomId: string = null;
  public executeOutSide: boolean = null;//Lam ngoai
  public isConfirm: boolean = null;//Kiểm tra chỉ định này đã được xác nhận chưa nếu là làm cung
  public treatmentSchedule: MedicalSchedule = new MedicalSchedule()
  public hasSchedule: boolean = null;
  public connectSchedule: boolean = null;
  public staffCreateId: string = null;//Id người tạo
}
