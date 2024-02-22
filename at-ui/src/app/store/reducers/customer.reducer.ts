import Customer from '../../../../../at-common/model/Customer';
import { Action } from '@ngrx/store';
import { createReducer, on } from '../utils/store.util';

import {
  clearStateCustomer,
  loadCustomers,
  loadCustomersSuccess,
  onCreateCustomer,
  onLoadCustomerByCode,
  onLoadCustomerByCodeSuccess,
  onLoadCustomerById,
  onLoadCustomerByIdSuccess,
  onLoadCustomersFilter,
  onLoadCustomersFilterSuccess,
  onLoadCustomersSearchSuccess,
  onLoadMedReByCustomerCode,
  onLoadMedReByCustomerCodeSuccess,
  onUpdateCustomer,
  onGetFilterCustomer,
  onSendNotiPayment
} from '../actions/customer.action';
import {
  CustomerState
} from '../entities/state.entity';
import { state } from '@angular/animations';
import { onLoadCustomersSearch } from 'src/app/store/actions/customer.action';

const initialState: CustomerState = {
  customerList: [],
  customerFilter: null,
  customerSearch: null,
  customerItem: null,
  medicalCustomer: null,
  filterCustomer: null,
  message: ''
};

export const reducer = createReducer(
  initialState,
  on(loadCustomers, (state, action) => ({
    ...state
  })),
  on(loadCustomersSuccess, (state, action) => ({
    ...state,
    customerList: action.customerList
  })),
  on(onCreateCustomer, (state, action) => ({
    ...state
  })),
  on(onLoadCustomersFilter, (state, action) => ({
    ...state
  })),
  on(onLoadCustomersFilterSuccess, (state, action) => ({
    ...state,
    customerFilter: action.customerFilter
  })),
  on(onLoadCustomersSearch, (state, action) => ({
    ...state
  })),
  on(onLoadCustomersSearchSuccess, (state, action) => ({
    ...state,
    customerSearch: action.customerFilter
  })),
  on(onLoadCustomerById, (state, action) => ({
    ...state,
  })),
  on(onLoadCustomerByIdSuccess, (state, action) => ({
    ...state,
    customerItem: action,
  })),
  on(onLoadCustomerByCode, (state, action) => ({
    ...state,
  })),
  on(onLoadCustomerByCodeSuccess, (state, action) => ({
    ...state,
    customerItem: action,
  })),
  on(onLoadMedReByCustomerCode, (state, action) => ({
    ...state,
  })),
  on(onSendNotiPayment, (state, action) => ({
    ...state,
  })),
  on(onLoadMedReByCustomerCodeSuccess, (state, action) => ({
    ...state,
    medicalCustomer: action,
  })),
  on(onUpdateCustomer, (state, action) => ({
    ...state,
  })),
  on(onGetFilterCustomer, (state, action) => ({
    ...state,
    filterCustomer: action.filterCustomer
  })),
  on(clearStateCustomer, (state, action) => ({
    ...state,
    customerFilter: null,
  })),
);

export function customerReducer(state: CustomerState | undefined, action: Action) {
  return reducer(state, action);
}
