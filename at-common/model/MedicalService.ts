import BaseEntity from "../base/BaseEntity";
import ValidationDecorator from "../utilities/validation/ValidationDecorator";
import Constants from "../base/Constants";
import MedicalServiceSupply from "./MedicalServiceSupply";
import { PRICE_TYPE } from "./enum";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
/** Dịch vụ  */
export default class MedicalService extends BaseEntity<MedicalService> { 
  @ValidationDecorator.required(Constants.NAME_REQUIRE)
  name: string = null;// tên dịch vụ
  name_en: string = null;// tên dịch vụ không dấu để search
  price: number = null;// giá dich vụ
  priceMin: number = null;// giá dich vụ nhỏ nhất
  priceMax: number = null;// giá dich vụ cao nhất
  priceType:string =PRICE_TYPE.FIX;// loại giá Cố định/Điều chỉnh
  description: string = null; // mô tả 
  medicalServiceGroupId: string = null;// nhóm dịch vụ
  @IgnoreDecorator.ignoreInDb()
  medicalServiceGroupName: string = null;// tên nhóm dịch vụ
  orderDisplay:number = 1;
  tagService: string = null; //Tên nhóm dịch vụ theo tag
  constructor() {
    super();
  }

  public assign(obj: any) {
    this._id = obj._id;    
    this.name = obj.hasOwnProperty("name") ? obj.name : this.name;
    this.name_en = obj.hasOwnProperty("name_en") ? obj.name_en : this.name_en;
    this.price = obj.hasOwnProperty("price") ? obj.price : this.price;
    this.description = obj.hasOwnProperty("description") ? obj.description : this.description;
    this.medicalServiceGroupId = obj.hasOwnProperty("medicalServiceGroupId") ? obj.medicalServiceGroupId : this.medicalServiceGroupId;
    this.orderDisplay = obj.hasOwnProperty("orderDisplay") ? obj.orderDisplay : this.orderDisplay;
    this.priceType = obj.hasOwnProperty("priceType") ? obj.priceType : this.priceType;
    this.priceMin = obj.hasOwnProperty("priceMin") ? obj.priceMin : this.priceMin; 
    this.priceMax = obj.hasOwnProperty("priceMax") ? obj.priceMax : this.priceMax; 
    this.tagService = obj.hasOwnProperty("tagService") ? obj.tagService : this.tagService;  
    this.medicalServiceGroupName = obj.hasOwnProperty("medicalServiceGroupName") ? obj.medicalServiceGroupName : this.medicalServiceGroupName;    
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;

  }
  public static newInstance(): MedicalService {
    let result = new MedicalService();
    return result;
  }
}