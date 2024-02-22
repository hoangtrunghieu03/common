import { Injectable } from '@angular/core';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import ServiceRequestManager from '../../../../../at-common/model/manager/ServiceRequestManager';
import ServiceRequest from '../../../../../at-common/model/ServiceRequest';
import { RootState } from '../entities/state.entity';
import { Store } from '@ngrx/store';
import { showProgress } from '../actions/progress.action';

@Injectable()
export class ServiceRequestService {

    constructor(
        private store: Store<RootState>) {
    }

    async onLoadServiceRequest(): Promise<HttpStatus<ServiceRequest[]>> {
        this.store.dispatch(showProgress());
        const serviceRequestManager = new ServiceRequestManager(null);
        return serviceRequestManager.search(null);
    }

    async onLoadServiceRequestFilter(filter: { typeServiceRequest: string }): Promise<HttpStatus<ServiceRequest[]>> {
        this.store.dispatch(showProgress());
        const serviceRequestManager = new ServiceRequestManager(null);
        let result = { typeServiceRequest: filter.typeServiceRequest }
        serviceRequestManager.classInfo.endPoint = serviceRequestManager.classInfo.endPoint.concat('/filter');
        return serviceRequestManager.search(result);
    }

    async onCreateServiceRequest(serviceRequest: ServiceRequest): Promise<HttpStatus<ServiceRequest>> {
        this.store.dispatch(showProgress());
        const serviceRequestManager = new ServiceRequestManager(null);
        return serviceRequestManager.insert(serviceRequest);
    }
}