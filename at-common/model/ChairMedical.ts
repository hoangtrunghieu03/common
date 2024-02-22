import { CHAIR_STATUS } from "./enum";
/** THÔNG TIN GHẾ CHỮA TRỊ */
export default class ChairMedical {
  public chairId : string=null ;// id của ghế
  public staffId: string =null;// kĩ thuật viên
  public medicalServiceId: Array<string> =null;// id dịch vụ
  public status:string = CHAIR_STATUS.AVAILABLE;// Trạng thái ghế chữa trị
  public name:string = null;// Tên ghế
}