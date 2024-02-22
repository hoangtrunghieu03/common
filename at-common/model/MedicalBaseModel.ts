import { IsoDateHelper } from "../utilities/helpers/IsoDateHelper";
import { OPERATOR_SERVICE_STATUS, UNIT } from "./enum";

export default class MedicalBaseModel {
  public _id: string = null; //ID object trong ho so benh an
  public id: string = null;// id của dịch vụ
  public name: string = null;//tên dịch vụ
  public name_en: string = null;//tên dịch vụ
  public quantity: number = 1;// số lượng
  public comment: string = null;// giải thích
  public status: string = OPERATOR_SERVICE_STATUS.NOT_FINISH;// trạng thái
  public staffId: any = null;// id bác sỹ thực hiện array/string
  public statusPayment: string = null;// trạng thái thanh toán
  public createDateTime?: Date = IsoDateHelper.getISODateByTimezone('Asia/Ho_Chi_Minh');
  public updateDateTime?: Date = null;
  public executionDate?: string = null; // Ngày thực hiện
  public finishDate?: string = null;  //Ngày hoàn thành
  public executeOutSide?: boolean = false;// làm ngoài 
  public sampleSender?: string = null; // ID người gửi mẫu 
  public sampleReceiver?: string = null; // ID người nhận mẫu
  public applianceReceiver?: string = null; // ID người nhận khí cụ
  public indicater?: string = null; // Người chỉ định dịch vụ thực hiện/dịch vụ chỉ định
  public roomId?: string = null;// Phòng thực hiện dịch vụ
  public isCombo: boolean = false; //Kiem tra có hiển thị ở thanh toán và phiếu in true: không hiển thị; flase: hiển thị
  public listIndicate: Array<MedicalBaseModel> = null;//Danh sach chi dinh co trong combo
  public indicateShortName?: string = null;
  public groupIndicateShortName?: string = null;
  public groupIndicateName?: string = null;
  public typeIndicate?: string = null; //Loại chỉ định Chụp hình/Làm cung

  public money: number = 0;// chi phí 1 dịch vụ
  public totalMoney: number = 0; // Tổng giá tiền
  public discountMoney: number = 0; // Giá giảm
  public discountUnit: string = UNIT.PRICE;// Loai giam
  public discountValue: number = 0; // Giá trị giảm
}