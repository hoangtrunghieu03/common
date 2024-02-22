import { Injectable } from '@angular/core';
import Customer from '../../../../../at-common/model/Customer';
import CustomerManager from '../../../../../at-common/model/manager/CustomerManager';
import HttpStatus from '../../../../../at-common/base/HttpStatus';
import CustomerReport from '../../../../../at-common/model/CustomerReport';
import CustomerReportManager from '../../../../../at-common/model/manager/CustomerReportManager';
import MedicalRecord from '../../../../../at-common/model/MedicalRecord';
import MedicalRecordManager from '../../../../../at-common/model/manager/MedicalRecordManager';
import MedicalRecordReportManager from '../../../../../at-common/model/manager/MedicalRecordReportManager';
import MedicalRecordReport from '../../../../../at-common/model/MedicalRecordReport';
import { RootState } from '../entities/state.entity';
import { Store } from '@ngrx/store';
import { showProgress } from '../actions/progress.action';

@Injectable()
export class CustomerService {

  constructor(
    private store: Store<RootState>
) {
  }

  async loadAllCustomers(): Promise<HttpStatus<Customer[]>> {
    this.store.dispatch(showProgress());
    const customerManager = new CustomerManager(null);
    customerManager.classInfo.endPoint = customerManager.classInfo.endPoint.concat('');
    return customerManager.search(null);
  }

  async onCreateCustomer(customer: Customer): Promise<HttpStatus<Customer>> {
    this.store.dispatch(showProgress());
    const customerManager = new CustomerManager(null);
    return customerManager.insert(customer);
  }

  async onLoadCustomersFilter(filter): Promise<HttpStatus<CustomerReport[]>> {
    this.store.dispatch(showProgress());
    const customerManager = new CustomerReportManager(null);
    customerManager.classInfo.endPoint = customerManager.classInfo.endPoint.concat('/customerFilter');
    return customerManager.search(filter);
  }

  async onLoadCustomersSearch(filter): Promise<HttpStatus<CustomerReport[]>> {
    this.store.dispatch(showProgress());
    const customerManager = new CustomerReportManager(null);
    customerManager.classInfo.endPoint = customerManager.classInfo.endPoint.concat('/customerSearch');
    return customerManager.search(filter);
  }


  async onLoadCustomerById(action): Promise<HttpStatus<Customer>> {
    this.store.dispatch(showProgress());
    const customerManager = new CustomerManager(null);
    let id = action.customerId;
    return customerManager.get(id);
  }

  async onLoadCustomerByCode(action): Promise<HttpStatus<Customer>> {
    this.store.dispatch(showProgress());
    const customerManager = new CustomerManager(null);
    customerManager.classInfo.endPoint = customerManager.classInfo.endPoint.concat('/customerCode');
    let customerCode = action.customerCode;
    return customerManager.get(customerCode);
  }

  async onLoadMedReByCustomerCode(action): Promise<HttpStatus<MedicalRecordReport>> {
    this.store.dispatch(showProgress());
    const medicalRecordManager = new MedicalRecordReportManager(null);
    medicalRecordManager.classInfo.endPoint = medicalRecordManager.classInfo.endPoint.concat('/allMedicalRecodeByCustomer');
    let customerCode = action.customerCode;
    return medicalRecordManager.get(customerCode);
  }

  async onUpdateCustomer(customer: Customer): Promise<HttpStatus<Customer>> {
    this.store.dispatch(showProgress());

    const customerManager = new CustomerManager(null);

    return customerManager.update({ _id: customer._id }, customer);

  }
  async onSendNotiPayment(customer): Promise<HttpStatus<Customer>> {
    this.store.dispatch(showProgress());
    const customerManager = new CustomerManager(null);
    customerManager.classInfo.endPoint = customerManager.classInfo.endPoint.concat('/sendNotiPayment');
    return customerManager.insert(customer);
  }

}
