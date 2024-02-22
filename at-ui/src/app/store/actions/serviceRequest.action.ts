import { createAction, props } from '@ngrx/store';
import ServiceRequest from '../../../../../at-common/model/ServiceRequest';

export const ServiceRequestAction = {
    onLoadServiceRequest: '[Dashboard] Load Service Request',
    onLoadServiceRequestSuccess: '[Dashboard] Load Service Request Successfully',

    onLoadServiceRequestFilter: '[Dashboard] Load Service Request Filter',
    onLoadServiceRequestFilterSuccess: '[Dashboard] Load Service Request Filter Successfully',

    onCreateServiceRequest: '[Dashboard] Create Service Request',
};

export const onLoadServiceRequest = createAction(ServiceRequestAction.onLoadServiceRequest);
export const onLoadServiceRequestSuccess = createAction(ServiceRequestAction.onLoadServiceRequestSuccess,
    props<{ serviceRequest: ServiceRequest[] }>()
);

export const onLoadServiceRequestFilter = createAction(ServiceRequestAction.onLoadServiceRequestFilter,
    props<{ typeServiceRequest: string }>()
);
export const onLoadServiceRequestFilterSuccess = createAction(ServiceRequestAction.onLoadServiceRequestFilterSuccess,
    props<{ serviceRequest: ServiceRequest[] }>()
);

export const onCreateServiceRequest = createAction(ServiceRequestAction.onCreateServiceRequest,
    props<ServiceRequest>()
);