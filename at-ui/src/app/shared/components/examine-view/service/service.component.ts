import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { NgbModal, NgbModalRef, NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { takeUntil } from 'rxjs/operators';
import { ServiceAddDialogComponent } from 'src/app/components/settings/setting-service/service-add-dialog/service-add-dialog.component';
import { SERVICE_COLDEF } from 'src/app/shared/data/examine';
import { formatCurentcy, formatCurrencyNumber } from 'src/app/shared/functions/function-helper';
import { ConfirmModalComponent } from 'src/app/shared/modal/confirm-modal/confirm-modal.component';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { onLoadMedicalComboService } from 'src/app/store/actions/medicalComboService.action';
import { onAddMedicalService, onAddMedicalServiceIndicates, onMedicalSICommand } from 'src/app/store/actions/medicalRecord.action';
import { onLoadMedicalService } from 'src/app/store/actions/medicalService.action';
import { onLoadServiceIndicate } from 'src/app/store/actions/serviceIndicate.action';
import { loadStaff } from 'src/app/store/actions/staffs.action';
import { RootState } from 'src/app/store/entities/state.entity';
import { OPERATOR_SERVICE_STATUS, UNIT } from '../../../../../../../at-common/model/enum';
import MedicalBaseModel from '../../../../../../../at-common/model/MedicalBaseModel';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import MedicalService from '../../../../../../../at-common/model/MedicalService';
import Staffs from '../../../../../../../at-common/model/Staffs';
import DeactivateGuard from '../../../directives/deactive-guard';
import ColumnDef from '../../at-base-table/at-base-table.component';
import { DesignatComponent } from '../designat/designat.component';

@Component({
  selector: 'at-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss'],
  providers: [DestroySubsribeService]
})
export class ServiceComponent implements OnInit {

  @ViewChild(DesignatComponent, {static: false}) _designat: DesignatComponent;
  @Input() medicalRecordData: MedicalRecord;
  @Input() medicalDesignatData: MedicalBaseModel[] = [];
  @Input() medicalServiceData: MedicalBaseModel[] = [];
  @Output() eventChangeTab: EventEmitter<any> = new EventEmitter();

  colDef: Array<ColumnDef> = SERVICE_COLDEF;

  medicalServiceColDef: Array<ColumnDef> = MEDICAL_SERVICE_COLDEF;
  medicalServiceGroup: Array<{tagService: string, medicalService: MedicalService[], collapsed: boolean}> = [];
  medicalService: MedicalService[] = [];
  serviceAddition: MedicalService[] = [];
  medicalServiceCurrentState: MedicalBaseModel[] = [];
  medicalServiceOld: MedicalBaseModel[] = [];
  medicalDesignatOld: MedicalBaseModel[] = [];

  staffs: Staffs[] = [];
  staffLoginId: string = null;

  data : MedicalBaseModel[] = [];

  dataCheck : MedicalBaseModel[] = [];

  units: Array<{label: string, value: string}> = [];

  dataChange : Array<{serviceAddition: MedicalService , event : any}> = [];

  formatCurentcy = formatCurentcy;
  formatCurrencyNumber = formatCurrencyNumber;

  activeId: number = 1;

  constructor(
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
    private cd: ChangeDetectorRef,
    public _modal: NgbModal,
    public deactivate: DeactivateGuard
  ) {
  }

  ngOnInit(): void {
    this.units = Object.values(UNIT).map(item => ({label: item, value: item}));

    this.store.dispatch(onLoadServiceIndicate());
    this.store.dispatch(onLoadMedicalComboService());

    this.onLoadMedicalService();
    this.onLoadStaffs();
    this.onLoadStaffLogin();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.onSetDataService();
    this.cd.detectChanges();
  }

  onSetDataService = () => {
    this.medicalDesignatData = _.cloneDeep(this.medicalDesignatData);
    this.medicalDesignatOld = _.cloneDeep(this.medicalDesignatData);

    this.medicalServiceData = _.cloneDeep(this.medicalServiceData);
    this.medicalServiceCurrentState = _.cloneDeep(this.medicalServiceData);
    this.medicalServiceOld = _.cloneDeep(this.medicalServiceCurrentState);
  }

  ngDoCheck(): void {
    if (this.activeId == 1) {
      if ((!_.isEqual(this._designat?.serviceIndicateSelected, this.medicalDesignatOld) || this._designat?.serviceIndicateAddition.length != 0) && this.deactivate.canChange) {
        return this.deactivate.setCanDeactivate(false);
      }
      if ((_.isEqual(this._designat?.serviceIndicateSelected, this.medicalDesignatOld) && this._designat?.serviceIndicateAddition.length == 0) && !this.deactivate.canChange) {
        return this.deactivate.setCanDeactivate(true);
      }
    }
    if (this.activeId == 2) {
      if (!_.isEqual(this.medicalServiceData, this.medicalServiceOld) && !_.isEqual(this.medicalServiceData, this.medicalServiceCurrentState) && this.deactivate.canChange) {
        this.medicalServiceCurrentState = _.cloneDeep(this.medicalServiceData);
        return this.deactivate.setCanDeactivate(false);
      }
      if (_.isEqual(this.medicalServiceData, this.medicalServiceOld) && !this.deactivate.canChange) {
        this.medicalServiceCurrentState = _.cloneDeep(this.medicalServiceData);
        return this.deactivate.setCanDeactivate(true);
      }
    }
  }

  onNavChange(changeEvent: NgbNavChangeEvent) {
    changeEvent.preventDefault();
    if (!this.deactivate.canChange) return this.onConfirmChangeScreen(changeEvent.activeId, changeEvent.nextId);
    this.activeId = changeEvent.nextId;
    this.cd.detectChanges();
  }

  onConfirmChangeScreen = (tabId: number, nextId: number) => {
    this.deactivate.setCanDeactivate(true);
    if (tabId == 1) this.onSaveDesignat(null);
    if (tabId == 2) this.onSaveService(3);
    this.activeId = nextId;
    this.cd.detectChanges();
  }

  onLoadStaffs = ():void => {
    this.store.dispatch(loadStaff());
    this.store.select(state => state.staff.staffList)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe(staff => staff && (this.staffs = staff))
  }

  onLoadStaffLogin = ():void => {
    this.store.select(state => state.authencation._id)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe(staffId => staffId && (this.staffLoginId = staffId))
  }

  onLoadMedicalServiceGroup = () => {
    if (!this.medicalService || this.medicalService.length == 0) return this.medicalServiceGroup = [];
    this.medicalServiceGroup = [];
    this.medicalService[0]['disable'] = this.medicalRecordData.treatmentProcesses.some(val => val.serviceId === this.medicalService[0]._id);
    this.medicalServiceGroup.push({ tagService: this.medicalService[0].tagService, medicalService: [this.medicalService[0]], collapsed: false });
    this.medicalService.forEach((medicalService, index) => {
      if (index === 0) return;
      medicalService['disable'] = this.medicalRecordData.treatmentProcesses.some(val => val.serviceId === medicalService._id);
      let indexGroupExist = this.medicalServiceGroup.findIndex(x => x.tagService === medicalService.tagService);
      if (indexGroupExist === -1) {
        return this.medicalServiceGroup.push({ tagService: medicalService.tagService, medicalService: [medicalService], collapsed: false });
      }
      this.medicalServiceGroup[indexGroupExist].medicalService.push(medicalService);
    });
  }

  onLoadMedicalService = ():void => {
    this.store.dispatch(onLoadMedicalService());
    this.store.select(state => state.medicalService.medicalServices)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe(service => {
        if (!service) return;
        this.medicalService = _.cloneDeep(service);
        this.onLoadMedicalServiceGroup();
      })
  }

  onSelectedService = (event, serviceItem: MedicalService , add: boolean): void => {
    if(add){
      this.dataChange.push({
        serviceAddition : serviceItem,
        event : event
      })
    }
    let service: MedicalBaseModel = new MedicalBaseModel();
    service.name = serviceItem.name;
    service.status = OPERATOR_SERVICE_STATUS.NOT_FINISH;
    service.id = serviceItem._id;
    service.money = serviceItem.price;
    service.indicater = this.staffLoginId;
    service.totalMoney = serviceItem.price;
    service.totalMoney = this.onChangeDiscountValue(service, null);
    let index: number = this.medicalServiceData?.findIndex(val => val.name == serviceItem.name);
    let medicalServiceData = _.cloneDeep(this.medicalServiceData);
    if (event.target.checked) {
      medicalServiceData.push(service)
    } else {
      medicalServiceData.splice(index, 1);
    }
    this.medicalServiceData = _.cloneDeep(medicalServiceData);
  }

  checkedServiceSelected = (serviceItem: MedicalService):boolean => {
    return this.medicalServiceData.some(val => val.name === serviceItem.name)
  }

  handleCountPriceService = ():number => {
    return this.medicalServiceData.reduce((acc, val) => acc += formatCurrencyNumber(val.totalMoney) , 0)
  }

  onSaveDesignat = (index):void => {
    let serviceIndicateList = this._designat?.serviceIndicateSelected.concat(this._designat?.serviceIndicateAddition);
    serviceIndicateList.forEach(val => {
      val.money = formatCurrencyNumber(val.totalMoney)
      val.totalMoney = formatCurrencyNumber(val.totalMoney)
    });
    let data = {_id: this.medicalRecordData?._id, medicalServiceIndicatesUpdate: serviceIndicateList}
    this.store.dispatch(onAddMedicalServiceIndicates(data))
    this.deactivate.setCanDeactivate(true);
    index && (this.activeId = index);
  }

  onSaveService = (tabIndex: number):void => {
    const dataCheck : any = [];
    this.onHandleData(this.data);
    let dataFilter = this.onFilterData(this.data, this.medicalServiceData);
    this.onHandleData(this.dataCheck);
    const result = this.onCheckDateDate(this.dataCheck , dataFilter );
    const handleMoney = this.onHandleMoney(result);
    this.medicalServiceData = this.onSortData(handleMoney)
    this.medicalServiceData = this.onLastHandleData(this.medicalServiceData , dataCheck);
    this.medicalServiceData.forEach(val => {
      val.money = formatCurrencyNumber(val.money);
      val.discountValue = formatCurrencyNumber(val.discountValue)
      let totalMoney = (val.money * val.quantity) - val.discountMoney ;
      totalMoney = totalMoney > 0 ? totalMoney : 0;
      val.totalMoney = formatCurrencyNumber(totalMoney);
    })

    let data = {_id: this.medicalRecordData?._id, medicalServicesUpdate: this.medicalServiceData}
    this.store.dispatch(onAddMedicalService(data))
    this.deactivate.setCanDeactivate(true);
    this.eventChangeTab.emit(tabIndex);
    this.data = [];
    this.dataCheck = [];
  }

  onDecrease = (row, fieldName):void => {
    row[fieldName] -= 1;
    this.onChangeDiscountValue(row, null);
  }

  onIncrease = (row, fieldName):void => {
    const today  = new Date();
    const todayFull = today.getFullYear()+'-'+String(today.getMonth() + 1).padStart(2, '0')+"-"+String(today.getDate()).padStart(2, '0');
    if(row.createDateTime.toString().slice(0 , 10) !== todayFull) {
      this.data.push({
        ...row ,
        createDateTime: todayFull,
        quantity : 1,
      })
      this.dataCheck.push({
        ...row ,
        quantity : 1
      })
    }
    row[fieldName] += 1;
    this.onChangeDiscountValue(row, null);
  }

  onSortData = (data : any) =>{
    data.sort((a, b) => new Date(a.createDateTime).valueOf() - new Date(b.createDateTime).valueOf());
     return data;
  }

  onHandleData = (data : any) =>{
    for(let i = 0 ; i < data.length ; i++){
      let firstDate = data[i].createDateTime.toString().slice(0, 10);
      for(let j = i + 1; j < data.length ; j++){
        let lastDate = data[j].createDateTime.toString().slice(0, 10);
        if(data[i].id === data[j].id && firstDate === lastDate){
          data[j] = {
            ...data[j],
            quantity : data[i].quantity + data[j].quantity,
          }
          data.splice(i, 1);
        }
      }
    }
  }

  onHandleMoney = (data: any) => {
    let result: any = [];
    data.map(item => {
      item = {
        ...item,
        totalMoney: item.quantity * item.money,
      }
      result.push(item);
    })
    return result;
  }

  onFilterData = (firstData: any, lastData: any) => {
    let result : any = [];
    firstData.map((item, index) => {
      let firstDataDate = item.createDateTime.toString().slice(0, 10);
      lastData.map((itemLastData , indexLast ) => {
        let lastDataDate = itemLastData.createDateTime.toString().slice(0, 10)
        if (item.id === itemLastData.id && firstDataDate === lastDataDate) {
          itemLastData = {
            ...itemLastData,
            quantity: item.quantity + itemLastData.quantity,
          }
          result.push(itemLastData)
          firstData.splice(index, 1);
          lastData.splice(indexLast, 1);
        }
      })
    })
    return lastData.concat(result.concat(firstData));
  }


  onCheckDateDate = (data: any, dataCheck: any) => {
    let resultData : any = [];
    data.map((item , index) => {
      let dataDate = item.createDateTime.toString().slice(0, 10);
      dataCheck.map((itemData , indexCheck) => {
        let dataCheckDate = itemData.createDateTime.toString().slice(0, 10);
        if(item.id === itemData.id && dataDate === dataCheckDate ) {
          itemData = {
            ...item,
            quantity: itemData.quantity - item.quantity,
          }
          resultData.push(itemData);
          data.splice(index, 0);
          dataCheck.splice(indexCheck, 1);
        }
      })
    })
    return resultData.concat(dataCheck);
  }

  onLastHandleData(data : any , dataCkeck : any = []) {
    data.forEach((item) => {
      let firstDataDate = item.createDateTime.toString().slice(0, 10);
      const result = dataCkeck.some((item1,index) => {
        let lastDataDate = item1.createDateTime.toString().slice(0, 10)
        if (item1?.id === item.id && firstDataDate === lastDataDate) {
          item1 = {
            ...item1,
            discountMoney : item1.discountMoney + item.discountMoney,
            quantity: item1.quantity + item.quantity,
            totalMoney: item1.totalMoney + item.totalMoney,
          }
        dataCkeck.splice(index ,1);
        dataCkeck.push(item1);
          return true;
        }
        return false;
      })
      if (!result) {
        dataCkeck.push(item);
      }
    })
    return dataCkeck
  }

  changeQuantity(row, event) {
    if (Number(event.target.value) == 0) {
      row.quantity = 1;
      event.target.value = 1;
    } else {
      row.quantity = Number(event.target.value);
    }
    this.onChangeDiscountValue(row, null);
  }

  onDeleteService(row) {
    if (this.dataChange.length > 0) {
      let check: boolean = false;
      this.dataChange?.find((val, index) => {
        if (val.serviceAddition.name === row.name) {
          val.event.target.checked = false;
          this.onSelectedService(val.event, val.serviceAddition, false);
          this.dataChange.splice(index, 1);
          check = false;
        } else {
          check = true;
        }
      })
      if (check) {
        this.medicalServiceData = this.medicalServiceData.filter(val => {
          return val !== row;
        })
      }
    } else {
      this.medicalServiceData = this.medicalServiceData.filter(val => {
        return val !== row;
      })
    }
  }

  onChangeDiscountValue = (row: MedicalBaseModel, event) => {
    if (event && row.discountUnit === UNIT.PERCENT && row.discountValue > 100) {
      row.discountValue = 100;
      event.target.value = 100;
    }
    row.discountMoney = row.discountUnit === UNIT.PRICE ? formatCurrencyNumber(row.discountValue) : ((formatCurrencyNumber(row.money) * row.quantity) * (Number(row.discountValue) / 100));
    let total = (formatCurrencyNumber(row.money) * row.quantity) - row.discountMoney;
    return row.totalMoney = total >= 0 ? total : 0;
  }

  onChangeUnit = (row: MedicalBaseModel, unit: string) => {
    row.discountUnit = unit;
    row.discountValue = 0;
  }

  handleServiceItemPrice = (row) => {
    let priceService: number = this.medicalService.find(x => x._id === row.id)?.price;
    row.money = priceService ? formatCurentcy(row.quantity * priceService) : row.money;
  }
}

export const MEDICAL_SERVICE_COLDEF: Array<ColumnDef> = [
  {
    label: '',
    title: 'trash',
    style: 'text-align: center; width: 50px; min-width: 50px',
    headerStyle: 'text-align: center; width: 50px; min-width: 50px',
    canUpdate: true,
  },
  {
    label: 'Tên dịch vụ',
    title: 'name',
    style: 'text-align: center;width: 170px; min-width: 170px',
    headerStyle: 'text-align: center;width: 170px; min-width: 170px',
  },
  {
    label: 'Số lượng',
    title: 'quantity',
    colType: '',
    style: 'text-align: center; width: 150px; min-width: 150px',
    headerStyle: 'text-align: center; width: 150px; min-width: 150px',
    canUpdate: true,
    fieldUpdate: 'quantity',
    updateType: 'quantity',
  },
  {
    label: 'Giá dịch vụ',
    title: 'money',
    colType: '',
    style: 'text-align: center; width: 180px; min-width: 180px',
    headerStyle: 'text-align: center; width: 180px; min-width: 180px',
    canUpdate: true,
    fieldUpdate: 'money',
    updateType: 'money',
  },
  {
    label: 'Giảm giá',
    title: 'discountValue',
    colType: '',
    style: 'text-align: center; width: 200px; min-width: 200px',
    headerStyle: 'text-align: center; width: 200px; min-width: 200px',
    canUpdate: true,
  },
  {
    label: 'Tổng tiền',
    title: 'totalMoney',
    colType: 'money',
    style: 'text-align: center;width: 150px; min-width: 150px',
    headerStyle: 'text-align: center;width: 150px; min-width: 150px',
  },
  {
    label: 'Ghi chú',
    title: 'comment',
    style: 'text-align: center;width: 180px; min-width: 180px',
    headerStyle: 'text-align: center;width: 180px; min-width: 180px',
    canUpdate: true,
    fieldUpdate: "comment",
  },
];

