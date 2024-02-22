
import { ATConfigOptions } from './ATConfigOptions';
import AppConfiguration from '../../at-common/utilities/AppConfig';
import ATAttachmentsManager from './ATAttachments';
export class PosConfig {

    /**
     * Init Configuration for BOOKBOOK UI
     * @param environment evironment data
     */
    static init(environment: any) {
        // Init Config
        AppConfiguration.LoadConfiguration(ATConfigOptions, environment);
        AppConfiguration.LoadAttachments(ATAttachmentsManager);
        try {
            AppConfiguration.LoadAttachments(null);
        }
        catch(ex){}
    }

}







