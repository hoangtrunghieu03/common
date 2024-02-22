import { createAction, props } from '@ngrx/store';
import Customer from '../../../../../at-common/model/Customer';
import CustomerCriterial from '../../../../../at-common/model/CustomerCriterial';
import CustomerReport from '../../../../../at-common/model/CustomerReport';
import CustomerReportCurrent from '../../../../../at-common/model/CustomerReportCurrent';
import { CustomerFilter, CustomerList, Filters } from '../entities/customer.entity';
import MedicalRecordReport from '../../../../../at-common/model/MedicalRecordReport';

export const CustomerAction = {
  loadCustomers: '[Customer] Load Customers',
  loadCustomersSuccess: '[Customer] Load Customers Successfully',
  onCreateCustomer: '[Customers] create new Customer',
  onLoadCustomersFilter: '[Customer] load customer filter',
  onLoadCustomersFilterSuccess: '[Customer] load customers filter Successfully',
  onLoadCustomersSearch: '[Customer] load customer search',
  onLoadCustomersSearchSuccess: '[Customer] load customers search Successfully',
  onLoadCustomerById: '[Customer] load customer by Id',
  onLoadCustomerByIdSuccess: '[Customer] load customer by Id successfully',
  onLoadCustomerByCode: '[Customer] load customer by Code',
  onLoadCustomerByCodeSuccess: '[Customer] load customer by Code successfully',
  onLoadMedReByCustomerCode: '[Customer] Load Medical Record By Customer Code',
  onLoadMedReByCustomerCodeSuccess: '[Customer] Load Medical Record By Customer Code Success',
  onUpdateCustomer: '[Customer] Update Customer',
  onSendNotiPayment: '[Customer] send noti payment for customer',
  onGetFilterCustomer: '[Customer] Get Filter Customer',
  clearStateCustomer: '[Customer] clear State Customer',
};

/**
 * load list customer
 */
export const loadCustomers = createAction(CustomerAction.loadCustomers);
export const loadCustomersSuccess = createAction(CustomerAction.loadCustomersSuccess,
  props<CustomerList>()
);

/**
 * action create customer
 */
export const onCreateCustomer = createAction(CustomerAction.onCreateCustomer,
  props<Customer>()
);
/**
 * load customers with condition
 */
export const onLoadCustomersFilter = createAction(CustomerAction.onLoadCustomersFilter,
  props<CustomerReport>()
);
export const onLoadCustomersFilterSuccess = createAction(CustomerAction.onLoadCustomersFilterSuccess,
  props<{customerFilter: CustomerReport | CustomerReport[]}>()
);
/**
 * load customers search
 */
 export const onLoadCustomersSearch = createAction(CustomerAction.onLoadCustomersSearch,
  props<{ filter: { name: string} }>()
);
export const onLoadCustomersSearchSuccess = createAction(CustomerAction.onLoadCustomersSearchSuccess,
  props<{customerFilter: CustomerReport | CustomerReport[]}>()
);

/**
 * load customer by id
 */
export const onLoadCustomerById = createAction(CustomerAction.onLoadCustomerById,
  props<{customerId: string}>()
);

export const onLoadCustomerByIdSuccess = createAction(CustomerAction.onLoadCustomerByIdSuccess,
  props<Customer>()
);
/**
 * load customer by id
 */
 export const onLoadCustomerByCode = createAction(CustomerAction.onLoadCustomerByCode,
  props<{customerCode: string}>()
);

export const onLoadCustomerByCodeSuccess = createAction(CustomerAction.onLoadCustomerByCodeSuccess,
  props<Customer>()
);

/**
 * load all medical record by customer code
 */

export const onLoadMedReByCustomerCode = createAction(CustomerAction.onLoadMedReByCustomerCode,
  props<{customerCode: string}>()
)
export const onLoadMedReByCustomerCodeSuccess = createAction(CustomerAction.onLoadMedReByCustomerCodeSuccess,
  props<MedicalRecordReport>()
);
/**
 * send noti payment customer
 */
export const onSendNotiPayment = createAction(CustomerAction.onSendNotiPayment,
  props<{ reports: Array<CustomerReportCurrent> }>()
);
/**
 * update customer
 */
export const onUpdateCustomer = createAction(CustomerAction.onUpdateCustomer,
  props<Customer>()
);

export const onGetFilterCustomer = createAction(CustomerAction.onGetFilterCustomer,
  props<{ filterCustomer: CustomerReport }>()
);

export const clearStateCustomer = createAction(CustomerAction.clearStateCustomer);
