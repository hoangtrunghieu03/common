import BaseEntity from "../base/BaseEntity";
import ValidationDecorator from "../utilities/validation/ValidationDecorator";
import Constants from "../base/Constants";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
/** COmbo Dịch vụ  */
export default class MedicalComboService extends BaseEntity<MedicalComboService> {
  medicalComboServiceCode: string = null; // Mã combo dịch vụ    
  @ValidationDecorator.required(Constants.NAME_REQUIRE)
  name: string = null;// tên dịch vụ
  price: number = null;// giá dich vụ
  description: string = null; // mô tả   
  medicalServices: Array<string> = null;// ids của dịch vụ
  @IgnoreDecorator.ignoreInDb()
  medicalServicesName: Array<string> = null;//tên của dịch vụ
  medicalServiceIndicates: Array<string> = null;// ids của dịch vụ chỉ định
  @IgnoreDecorator.ignoreInDb()
  medicalServiceIndicatesName: Array<string> = null;//tên của dịch vụ chỉ định
  constructor() {
    super();
    this.medicalServices = new Array<string>();
    this.medicalServicesName = new Array<string>();
    this.medicalServiceIndicates = new Array<string>();
    this.medicalServiceIndicatesName = new Array<string>();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.medicalComboServiceCode = obj.hasOwnProperty("medicalComboServiceCode") ? obj.medicalComboServiceCode : this.medicalComboServiceCode;
    this.name = obj.hasOwnProperty("name") ? obj.name : this.name;
    this.price = obj.hasOwnProperty("price") ? obj.price : this.price;
    this.description = obj.hasOwnProperty("description") ? obj.description : this.description;
    this.medicalServices = obj.hasOwnProperty("medicalServices") ? obj.medicalServices : this.medicalServices;
    this.medicalServicesName = obj.hasOwnProperty("medicalServicesName") ? obj.medicalServicesName : this.medicalServicesName;
    this.medicalServiceIndicates = obj.hasOwnProperty("medicalServiceIndicates") ? obj.medicalServiceIndicates : this.medicalServiceIndicates;
    this.medicalServiceIndicatesName = obj.hasOwnProperty("medicalServiceIndicatesName") ? obj.medicalServiceIndicatesName : this.medicalServiceIndicatesName;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;

  }
  public static newInstance(): MedicalComboService {
    let result = new MedicalComboService();
    return result;
  }
}