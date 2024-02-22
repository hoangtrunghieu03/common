import Customer from '../../../../../at-common/model/Customer';
import CustomerCriterial from '../../../../../at-common/model/CustomerCriterial';
import CustomerReportCurrent from '../../../../../at-common/model/CustomerReportCurrent';
export interface CustomerList {
  customerList: Customer[],
}

export interface CustomerFilter {
  customersFilter: CustomerReportCurrent[]
}

export interface Filters {
  filter: CustomerCriterial
}

