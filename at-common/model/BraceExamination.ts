import BraceExaminationDiagnostic from "./BraceExaminationDiagnostic";
import BraceExaminationCheck from "./BraceExaminationCheck";
import OrthopedicCase from "./OrthopedicCase";
import BraceExaminationCheckMount from "./BraceExaminationCheckMount";
import BraceExaminationFuntional from "./BraceExaminationFuntional";
import BraceExaminationPlan from "./BraceExaminationPlan";
/** THÔNG TIN KIỂM TRA TRƯỚC KHI NIỀNG RĂNG */
export default class BraceExamination {
  public orthopedicCase: OrthopedicCase = new OrthopedicCase();//BỆNH ÁN CHỈNH HÌNH 
  public braceExaminationCheck:BraceExaminationCheck = new BraceExaminationCheck();//khám
  public braceExaminationCheckMount:BraceExaminationCheckMount = new BraceExaminationCheckMount();//KHÁM TRONG MIỆNG
  public braceExaminationFuntional:BraceExaminationFuntional = new BraceExaminationFuntional();//Khám chức năng và cận chức năng
  public diagnostic:BraceExaminationDiagnostic = new BraceExaminationDiagnostic();// bảng giá trị chuẩn đoán
  public braceExaminationPlan:BraceExaminationPlan = new BraceExaminationPlan();//MỤC TIÊU VÀ KẾ HOẠCH ĐIỀU TRỊ
  public classificationDisease:Array<string> = null  // PHÂN LOẠI BỆNH
  public examinationDate: Date = null;
  public createByUserId: string=null;    
  public updateByUserId: string=null;    
  public createDateTime: Date=null;    
  public updateDateTime: Date=null;  
  public examinationFlag : boolean = false
}