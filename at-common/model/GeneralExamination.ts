/** THÔNG TIN KIỂM TRA TỔNG QUÁT */
export default class GeneralExamination {
  public reason: Array<string> = [];// lý do đến khám
  public medicalHistory: Array<string> = [];// bệnh sử y khoa
  public personalHistory: Array<string> = [];// tiểu sử bản thân
  public dentalSymptoms: string = '';// triệu chứng nha khoa
  public tooth: Array<string> = [];// triệu chứng nha khoa
  public diagnostic: string = '';// chuẩn đoán
  public treatment: string = '';// điều trị
  public advice: string = '';// lời
  public examinationDate: Date = null;
  public createByUserId: string = null;
  public updateByUserId: string = null;
  public createDateTime: Date = null;
  public updateDateTime: Date = null;
  public examinationFlag: boolean = false
}