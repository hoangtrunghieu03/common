import BaseEntity from "../base/BaseEntity";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
import ValidationDecorator from "../utilities/validation/ValidationDecorator";
import Constants from "../base/Constants";
import DataAccess from "./DataAccess";
/** THÔNG TIN NHÂN VIÊN */
export default class Staffs extends BaseEntity<Staffs> {  
  staffCode: string = null; // mã nhân viên  
  @ValidationDecorator.required(Constants.STAFFS.STAFF_FULLNAME_REQUIRE)
  fullName: string;// tên nhân viên
  fullName_en: string;// tên nhân viên
  email: string = null;  // email nhân viên  
  password: string = 'abc123';  
  confirmPassword: string = 'abc123';
  tel: string = null;// số diện thoại nhân viên  
  birthday: Date = null; ;//sinh nhật  
  status: string = null;
  id_number: string = null; // số CMND
  issueDate: Date = null; // ngày cấp
  issuePlace: string = null; // nơi cấp
  roleId: string = null;// id of quyền
  dataAccessNameExtends: Array<string>=null;  // quyền truy cập bổ sung
  token: string = null;   
  @IgnoreDecorator.ignoreInDb()
  dataAccess: Array<string> = null;
  resetPassword: boolean = false; 
  roomIds:Array<string> = null;
  @IgnoreDecorator.ignoreInDb()
  roleName: Array<string> = null;
  constructor() {
    super();   
    this.dataAccess = new Array<string>();
    this.dataAccessNameExtends = new Array<string>();
    this.roomIds = new Array<string>();
  }

  public assign(obj: any) {
    this._id = obj._id;    
    this.staffCode = obj.hasOwnProperty("staffCode") ? obj.staffCode : this.staffCode;
    this.fullName = obj.hasOwnProperty("fullName") ? obj.fullName : this.fullName;   
    this.fullName_en = obj.hasOwnProperty("fullName_en") ? obj.fullName_en : this.fullName_en;   
    this.email = obj.hasOwnProperty("email") ? obj.email : this.email;   
    this.password = obj.hasOwnProperty("password") ? obj.password : this.password;
    this.roleId = obj.hasOwnProperty("roleId") ? obj.roleId : this.roleId;
    this.dataAccessNameExtends = obj.hasOwnProperty("dataAccessNameExtends") ? obj.dataAccessNameExtends : this.dataAccessNameExtends;
    this.tel = obj.hasOwnProperty("tel") ? obj.tel : this.tel;
    this.birthday = obj.hasOwnProperty("birthday") ? obj.birthday : this.birthday;  
    this.status = obj.hasOwnProperty("status") ? obj.status : this.status;
    this.id_number = obj.hasOwnProperty("id_number") ? obj.id_number : this.id_number;
    this.issueDate = obj.hasOwnProperty("issueDate") ? obj.issueDate : this.issueDate;
    this.issuePlace = obj.hasOwnProperty("issuePlace") ? obj.issuePlace : this.issuePlace;
    this.token = obj.hasOwnProperty("token") ? obj.token : this.token;
    this.confirmPassword = obj.hasOwnProperty("confirmPassword") ? obj.confirmPassword : this.confirmPassword;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;    
    this.dataAccess = obj.hasOwnProperty("dataAccess") ? obj.dataAccess : this.dataAccess;
    this.resetPassword = obj.hasOwnProperty("resetPassword") ? obj.resetPassword : this.resetPassword;
    this.roleName = obj.hasOwnProperty("roleName") ? obj.roleName : this.roleName;
    this.roomIds = obj.hasOwnProperty("roomIds") ? obj.roomIds : this.roomIds;
  }
  public static newInstance(): Staffs {
    let result = new Staffs();
    return result;
  }
}