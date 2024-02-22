import {ADJUST_WAREHORSE_REASON} from "../model/enum"
export default class MedicalSupplyHistoryCriterial {
    dateFrom: string = null ;
    dateTo: string = null ;
    name: string = null;
    reason: string = ADJUST_WAREHORSE_REASON.INPUT; //  'Nhập hàng', 'Xuất kho', 'Điều chỉnh kho';
    room: string = null; //Id phòng xuất
    unit: string = null;// đơn vị nhập
    origin: string = null;// đơn vị nhập
}