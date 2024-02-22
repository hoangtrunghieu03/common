import BaseEntity from "../base/BaseEntity";
import Constants from "../base/Constants";
import IgnoreDecorator from "../utilities/ignore-helper/IgnoreDecorator";
import ValidationDecorator from "../utilities/validation/ValidationDecorator";
/** THÔNG TIN NHÂN VIÊN */
export default class ZaloInfo extends BaseEntity<ZaloInfo> {
  url: string = null; // URL tạo accesstoken 
  urlPermission: string = null; // URL cấp quyền ứng dụng
  callBackUrl: string = null; // Official Account Callback Url
  redirectUrl: string = null; // Url trả về sau khi lấy code thành công
  codeChallenge : string = null; // Được tạo ra từ codeVerifier
  codeVerifier: string = null; //  1 chuỗi bất kỳ, format có đủ chữ hoa, chữ thường, số và dài 43 ký tự.
  @ValidationDecorator.required(Constants.ZALO.SECRET_KEY_REQUIRED)
  secret_key: string = null;// Khóa bí mật của ứng dụng
  refresh_token: string = null; //Refresh token dùng để tạo access token mới. Hiệu lực: 3 tháng
  access_token: string = null; //Access token dùng để gọi các Official Account API. Hiệu lực: 25 giờ
  @ValidationDecorator.required(Constants.ZALO.APP_ID_REQUIRED)
  app_id: string = null; //ID của ứng dụng.
  expire_in: string = null; //Thời hạn của access token (đơn vị tính: giây)
  @ValidationDecorator.required(Constants.ZALO.OA_ID_REQUIRED)
  oa_id: string = null;// ID của OA Zalo
  date_expire_refresh: Date = null; //Ngày hết hạn refresh_token
  date_expire_access: Date = null; //Ngày hết hạn access_token
  @IgnoreDecorator.ignoreInDb()
  grant_type: string = null;

  constructor() {
    super();
  }

  public assign(obj: any) {
    this._id = obj._id;
    this.url = obj.hasOwnProperty("url") ? obj.url : this.url;
    this.urlPermission = obj.hasOwnProperty("urlPermission") ? obj.urlPermission : this.urlPermission;
    this.callBackUrl = obj.hasOwnProperty("callBackUrl") ? obj.callBackUrl : this.callBackUrl;
    this.redirectUrl = obj.hasOwnProperty("redirectUrl") ? obj.redirectUrl : this.redirectUrl;
    this.codeChallenge = obj.hasOwnProperty("codeChallenge") ? obj.codeChallenge : this.codeChallenge;
    this.codeVerifier = obj.hasOwnProperty("codeVerifier") ? obj.codeVerifier : this.codeVerifier;
    this.secret_key = obj.hasOwnProperty("secret_key") ? obj.secret_key : this.secret_key;
    this.refresh_token = obj.hasOwnProperty("refresh_token") ? obj.refresh_token : this.refresh_token;
    this.access_token = obj.hasOwnProperty("access_token") ? obj.access_token : this.access_token;
    this.app_id = obj.hasOwnProperty("app_id") ? obj.app_id : this.app_id;
    this.expire_in = obj.hasOwnProperty("expire_in") ? obj.expire_in : this.expire_in;
    this.oa_id = obj.hasOwnProperty("oa_id") ? obj.oa_id : this.oa_id;
    this.date_expire_refresh = obj.hasOwnProperty("date_expire_refresh") ? obj.date_expire_refresh : this.date_expire_refresh;
    this.date_expire_access = obj.hasOwnProperty("date_expire_access") ? obj.date_expire_access : this.date_expire_access;
    this.grant_type = obj.hasOwnProperty("grant_type") ? obj.grant_type : this.grant_type;
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;
  }
  public static newInstance(): ZaloInfo {
    let result = new ZaloInfo();
    return result;
  }
}