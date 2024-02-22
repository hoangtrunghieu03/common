import BaseEntity from "../base/BaseEntity";


export default class ServiceRequest extends BaseEntity<ServiceRequest> {
  serviceRequestName: string = null;  // Tên dịch vụ yêu cầu
  description: string = null;         // Mô tả
  typeServiceRequest: string = null;   // loại dịch vụ
  constructor() {
    super();   
  }

  public assign(obj: any) {
    this._id = obj._id;  
    this.serviceRequestName = obj.hasOwnProperty("serviceRequestName") ? obj.serviceRequestName : this.serviceRequestName;    
    this.typeServiceRequest = obj.hasOwnProperty("typeServiceRequest") ? obj.typeServiceRequest : this.typeServiceRequest;    
    this.description = obj.hasOwnProperty("description") ? obj.description : this.description;  
    this.createByUserId = obj.hasOwnProperty("createByUserId") ? obj.createByUserId : this.createByUserId;
    this.updateByUserId = obj.hasOwnProperty("updateByUserId") ? obj.updateByUserId : this.updateByUserId;
    this.createDateTime = obj.hasOwnProperty("createDateTime") ? obj.createDateTime : this.createDateTime;
    this.updateDateTime = obj.hasOwnProperty("updateDateTime") ? obj.updateDateTime : this.updateDateTime;
    
  }
  public static newInstance(): ServiceRequest {
    let result = new ServiceRequest();
    return result;
  }
}