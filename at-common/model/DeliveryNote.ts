import BaseEntity from "../base/BaseEntity";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
/** THÔNG TIN KHÁCH HÀNG */
export default class DeliveryNote extends BaseEntity<DeliveryNote> {
  typeDeliveryNote: string = null;//Loại phiếu
  sender: string = null; // Người giao
  receiver: string = null;// người nhận
  content: string = null;// nội dung
  image: string = null;// Phiếu
  // @IgnoreDecorator.ignoreInDb()
  // imageBase64: string = null;
  dateDelivery: Date = null;//Ngay giao nhan phieu
  @IgnoreDecorator.ignoreInDb()
  listDeliveryNote: Array<{ arcScheduleId: string, medicalRecordId: string, medicalServiceIndicateId: string }> = null;// 
  constructor() {
    super();
    this.listDeliveryNote = new Array<{ arcScheduleId: string, medicalRecordId: string, medicalServiceIndicateId: string }>();
  }


  public assign(obj: any) {
    this._id = obj._id;
    this.typeDeliveryNote = obj.hasOwnProperty("typeDeliveryNote") ? obj.typeDeliveryNote : this.typeDeliveryNote;
    this.sender = obj.hasOwnProperty("sender") ? obj.sender : this.sender;
    this.receiver = obj.hasOwnProperty("receiver") ? obj.receiver : this.receiver;
    this.content = obj.hasOwnProperty("content") ? obj.content : this.content;
    this.image = obj.hasOwnProperty("image") ? obj.image : this.image;
    this.dateDelivery = obj.hasOwnProperty("dateDelivery") ? obj.dateDelivery : this.dateDelivery;
    // this.imageBase64 = obj.hasOwnProperty("imageBase64") ? obj.imageBase64 : this.imageBase64;
    this.listDeliveryNote = obj.hasOwnProperty("listDeliveryNote") ? obj.listDeliveryNote : this.listDeliveryNote;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;
  }
  public static newInstance(): DeliveryNote {
    let result = new DeliveryNote();
    return result;
  }
}