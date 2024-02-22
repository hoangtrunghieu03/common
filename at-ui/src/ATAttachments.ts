import IAppAttachments from '../../at-common/base/interfaces/IAppAttachments';
import BaseObj from '../../at-common/base/BaseObj';
import ClassInfo from '../../at-common/base/ClassInfo';
import RestHelper from '../../at-common/utilities/helpers/RestHelper';
import ICache from '../../at-common/base/interfaces/ICache';
import BaseHelper from '../../at-common/base/BaseHelper';
import IPersisnance from "../../at-common/base/interfaces/IPersistance";
import Staffs from '../../at-common/model/Staffs';
declare var Promise: any;

/*
ADD ANY FUCTIONALY SPECIFIC TO THE API HERE.
FUNCTIONALITY CAN BE ADDED TO ANY HELPER/MANAGER CLASS AS MANAGER CLASSES ARE SINGLETONS.
THIS CLASS IS CALLED WHEN THE API IS STARTED.

THE IDEA, BUT NOT TESTED IS THAT A FUNCTION CAN BE ASSIGNED TO A HELPER CLASSES METHODS, SUCH AS ON BEFORE SAVE...

*/
class ATAttachments implements IAppAttachments {
    public getPersistance<T extends BaseObj>(classInfo: ClassInfo, user: Staffs): IPersisnance {
        if (classInfo.nameSpace == undefined || classInfo.nameSpace == null)
            throw Error("Your classinfo has no name space. It is required." + classInfo.type);
            return new RestHelper<T>(user);
    }

    public getCache<T extends BaseObj>(classInfo: ClassInfo, user: Staffs): ICache {
        return(null);
            //throw Error("No cache has been configured.");
    }

    public getAppDispatcher(){
        return null;
    }

    public SetAttachmentMethod<T extends BaseObj>(helper: BaseHelper<T>) {
        switch(helper.constructor['name']) {

            default:
                //do nothing.
        }
     }

}

let ATAttachmentsManager = new ATAttachments();
export default ATAttachmentsManager;





