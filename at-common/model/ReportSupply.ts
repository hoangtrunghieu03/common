import BaseEntity from "../base/BaseEntity";
import ReportRevenueCriterial from "./ReportRevenueCriterial";
import ReportSupplyList from "./ReportSupplyList";
import ReportSupplyDetail from "./ReportSupplyDetail";
import ReportSupplyRoom from "./ReportSupplyRoom";
import ReportSupplyRoomDetail from "./ReportSupplyRoomDetail";
/** BÁO CÁO TỒN KHO */
export default class ReportSupply extends BaseEntity<ReportSupply> {
  filter : ReportRevenueCriterial = null;
  supplies: Array<ReportSupplyList> = null;// Danh Sách Hàng Tồn
  details: Array<ReportSupplyDetail> = null;// Danh Sách Hàng Tồn chi tiet
  rooms: Array<ReportSupplyRoom> = null;// Danh Sách Hàng Tồn theo phòng
  roomDetails: Array<ReportSupplyRoomDetail> = null;// Danh Sách Hàng Tồn theo phòng
  constructor() {
    super();
    this.supplies = new Array<ReportSupplyList>();
    this.details = new Array<ReportSupplyDetail>();
    this.rooms = new Array<ReportSupplyRoom>();
    this.roomDetails = new Array<ReportSupplyRoomDetail>();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.filter = obj.hasOwnProperty("filter") ? obj.searchCriterial : this.filter;
    this.supplies = obj.hasOwnProperty("supplies") ? obj.details : this.supplies;
    this.details = obj.hasOwnProperty("details") ? obj.details : this.details;
    this.rooms = obj.hasOwnProperty("rooms") ? obj.rooms : this.rooms;
    this.roomDetails = obj.hasOwnProperty("roomDetails") ? obj.roomDetails : this.roomDetails;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;

  }
  public static newInstance(): ReportSupply {
    let result = new ReportSupply();
    return result;
  }
}