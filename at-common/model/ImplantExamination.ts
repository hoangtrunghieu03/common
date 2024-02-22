/** THÔNG TIN KIỂM TRA IMPLANT */
import ImplantExaminationTreatment from "./ImplantExaminationTreatment";
import ImplantExaminationDentalSymptoms from "./ImplantExaminationDentalSymptoms";
export default class ImplantExamination {
  public reason: Array<string> = null;// lý do đến khám
  public medicalHistory: Array<string> = null;// bệnh sử y khoa  
  public personalHistory: Array<string> = null;// tiểu sử bản thân
  public dentalSymptoms: ImplantExaminationDentalSymptoms = new ImplantExaminationDentalSymptoms();// triệu chứng nha khoa
  public tooth: Array<string> = [];// Răng
  public diagnostic: string = '';// chuẩn đoán
  public treatment: ImplantExaminationTreatment = new ImplantExaminationTreatment();// điều trị
  public advice: string = '';// lời khuyên
  public examinationDate: Date = null;
  public createByUserId: string = null;
  public updateByUserId: string = null;
  public createDateTime: Date = null;
  public updateDateTime: Date = null;
  public examinationFlag: boolean = false;
}