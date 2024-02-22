import BaseEntity from "../base/BaseEntity";
import ValidationDecorator from "../utilities/validation/ValidationDecorator";
import Constants from "../base/Constants";
import MedicalServiceSupply from "./MedicalServiceSupply";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
/** Dịch vụ chỉ định */
export default class MedicalServiceIndicate extends BaseEntity<MedicalServiceIndicate> { 
  @ValidationDecorator.required(Constants.NAME_REQUIRE)
  name: string = null;// tên dịch vụ
  name_en: string = null;// tên dịch vụ khong dấu để search
  price: number = null;// giá
  description: string = null; // mô tả 
  @IgnoreDecorator.ignoreInDb()
  medicalServiceIndicateGroupId: string = null;//nhóm dịch vụ chỉ định
  shortName: string = null; // Tên dịch vụ chỉ định dạng ABC-DEF
  @IgnoreDecorator.ignoreInDb()
  medicalServiceIndicateGroupName: string = null;//nhóm dịch vụ chỉ định
  // @IgnoreDecorator.ignoreInDb()
  medicalServiceIndicateGroupShortName: string = null; //Tên nhóm dịch vụ chỉ định dạng ABC-DEF
  orderDisplay:number = 1;
  tagService: string = null; //Tên nhóm dịch vụ chỉ định theo tag
  typeIndicate: string = null;
  constructor() {
    super();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.name = obj.hasOwnProperty("name") ? obj.name : this.name;
    this.name_en = obj.hasOwnProperty("name_en") ? obj.name_en : this.name_en;
    this.price = obj.hasOwnProperty("price") ? obj.price : this.price;
    this.description = obj.hasOwnProperty("description") ? obj.description : this.description;
    this.medicalServiceIndicateGroupId = obj.hasOwnProperty("medicalServiceIndicateGroupId") ? obj.medicalServiceIndicateGroupId : this.medicalServiceIndicateGroupId;
    this.orderDisplay = obj.hasOwnProperty("orderDisplay") ? obj.orderDisplay : this.orderDisplay; 
    this.shortName = obj.hasOwnProperty("shortName") ? obj.shortName : this.shortName; 
    this.tagService = obj.hasOwnProperty("tagService") ? obj.tagService : this.tagService; 
    this.typeIndicate = obj.hasOwnProperty("typeIndicate") ? obj.typeIndicate : this.typeIndicate; 
    this.medicalServiceIndicateGroupName = obj.hasOwnProperty("medicalServiceIndicateGroupName") ? obj.medicalServiceIndicateGroupName : this.medicalServiceIndicateGroupName;    
    this.medicalServiceIndicateGroupShortName = obj.hasOwnProperty("medicalServiceIndicateGroupShortName") ? obj.medicalServiceIndicateGroupShortName : this.medicalServiceIndicateGroupShortName;    
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;

  }
  public static newInstance(): MedicalServiceIndicate {
    let result = new MedicalServiceIndicate();
    return result;
  }
}