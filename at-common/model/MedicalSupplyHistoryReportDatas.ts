import { MEDICAL_SERVICE_TYPE } from "./enum";
export default class MedicalSupplyHistoryReportDatas {   
 date: string = null; // Ngày điều chỉnh/xuất/nhập kho
 name: string = null; //Tên vật tư
 qty: number = null; //số lượng điều chỉnh
 unit: string = null; // đơn vị
 room: string = null; //Phòng xuất đến
 staff: string = null; //Người điều chỉnh
 price: string = null; //đơn giá nhập
 total: string = null; //Tổng giá nhập/điều chỉnh
 origin: string = null; //Nha cung cap
}