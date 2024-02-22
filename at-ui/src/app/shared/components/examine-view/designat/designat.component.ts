import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Subject, timer } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { onLoadServiceIndicate } from 'src/app/store/actions/serviceIndicate.action';
import { onLoadServiceIndicateGroup } from 'src/app/store/actions/serviceIndicateGroup.action';
import { RootState } from 'src/app/store/entities/state.entity';
import MedicalServiceIndicateGroup from '../../../../../../../at-common/model/MedicalServiceIndicateGroup';
import MedicalServiceIndicate from '../../../../../../../at-common/model/MedicalServiceIndicate';
import { DESIGNAT_SERVICE } from '../../../data/recive';
import { DestroySubsribeService } from 'src/app/shared/service/destroySubscribe.service';
import { ServiceComponent } from '../service/service.component';
import MedicalBaseModel from '../../../../../../../at-common/model/MedicalBaseModel';
import { OPERATOR_SERVICE_STATUS, UNIT } from '../../../../../../../at-common/model/enum';
import * as _ from 'lodash';
import MedicalRecord from '../../../../../../../at-common/model/MedicalRecord';
import ColumnDef from '../../at-base-table/at-base-table.component';
import MedicalComboService from '../../../../../../../at-common/model/MedicalComboService';
import { onLoadMedicalComboService } from 'src/app/store/actions/medicalComboService.action';

@Component({
  selector: 'at-designat',
  templateUrl: './designat.component.html',
  styleUrls: ['./designat.component.scss'],
  providers: [DestroySubsribeService]
})
export class DesignatComponent implements OnInit {

  @Output() _formData: EventEmitter<any> = new EventEmitter();
  medicalServiceIndicateGroups: Array<{tagService: string, medicalServiceIndicates: MedicalServiceIndicate[]}> = [];
  medicalServiceIndicates: MedicalServiceIndicate[] = [];
  serviceIndicateAddition: MedicalBaseModel[] = [];
  medicalComboService: MedicalComboService[] = [];
  @Input() medicalRecordData: MedicalRecord;
  @Input() serviceIndicateSelected = [];
  subject = new Subject();
  staffLoginId: string = null;
  serviceStatus = OPERATOR_SERVICE_STATUS;

  medicalServiceIndicatesColDef: Array<ColumnDef> = MEDICAL_SERVICE_INDEICATE_COLDEF;

  constructor(
    private store: Store<RootState>,
    private destroy: DestroySubsribeService,
  ) {}

  ngOnInit(): void {
    this.onLoadStaffLogin();
    this.onLoadServicesIndicate();
    this.onLoadComboServiceList();
    this.onAddOtherComment();
  }

  onLoadStaffLogin = ():void => {
    this.store.select(state => state.authencation._id)
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe(staffId => staffId && (this.staffLoginId = staffId))
  }

  onAddOtherComment = (): void => {
    this.subject.pipe(debounceTime(300)).subscribe((val: string) => {
      let index: number = this.serviceIndicateAddition?.findIndex(val => val.name == 'Khác');
      let serviceData = _.cloneDeep(this.serviceIndicateAddition);
      if (index == -1) {
        let designatValue = this.medicalServiceIndicates.find(x => x.name === 'Khác');
        designatValue && serviceData.push(this.onSetMedicalBaseModel(designatValue, false, val));
      } else {
        serviceData[index].comment = val;
      }
      if (!val?.trim()) {
        serviceData.splice(index, 1);
      }
      this.serviceIndicateAddition = [...serviceData];
    })
  }

  onLoadServiceIndicateGroup = () => {
    if (!this.medicalServiceIndicates || this.medicalServiceIndicates.length == 0) return this.medicalServiceIndicateGroups = [];
    this.medicalServiceIndicateGroups = [];
    this.medicalServiceIndicates[0]['disabled'] = this.onCheckDesignat(this.medicalServiceIndicates[0], true);
    this.medicalServiceIndicateGroups.push({ tagService: this.medicalServiceIndicates[0].tagService, medicalServiceIndicates: [this.medicalServiceIndicates[0]] });
    this.medicalServiceIndicates.forEach((medicalService, index) => {
      if (index === 0 || medicalService.name === 'Khác') return;
      medicalService['disabled'] = this.onCheckDesignat(medicalService, true);
      let indexGroupExist = this.medicalServiceIndicateGroups.findIndex(x => x.tagService === medicalService.tagService);
      if (indexGroupExist === -1) {
        return this.medicalServiceIndicateGroups.push({ tagService: medicalService.tagService, medicalServiceIndicates: [medicalService] });
      }
      this.medicalServiceIndicateGroups[indexGroupExist].medicalServiceIndicates.push(medicalService);
    });
  }

  onLoadServicesIndicate = () => {
    this.store.select( state => state.serviceIndicate.serviceIndicates )
    .pipe(takeUntil(this.destroy.destroySub$))
    .subscribe( service => {
      if ( !service ) { return}
      this.medicalServiceIndicates = _.cloneDeep(service);
      this.onLoadServiceIndicateGroup();
    })
  }

  onLoadComboServiceList = (): void => {
    this.store
      .select((state) => state.medicalComboService.medicalComboServices)
      .pipe(takeUntil(this.destroy.destroySub$))
      .subscribe((medicalComboServices) => {
        medicalComboServices && (this.medicalComboService = medicalComboServices);
      });
  }

  onChangeSelected(event, value: MedicalServiceIndicate, isCombo: boolean): void {
    let serviceData = _.cloneDeep(this.serviceIndicateAddition);
    if (event.target.checked) {
      serviceData.push(this.onSetMedicalBaseModel(value, isCombo, null));
      this.serviceIndicateAddition = [...serviceData];
    } else {
      let index: number = this.serviceIndicateAddition?.findIndex(val => val.name == value.name);
      serviceData.splice(index, 1);
      this.serviceIndicateAddition = [...serviceData];
    }
  }

  onChangeComboSelected = (event, value) => {
    if (!value || value.medicalServiceIndicates?.length == 0) return;
    let serviceData = _.cloneDeep(this.serviceIndicateAddition);
    if (event.target.checked) {
      let comboBaseModel = this.onSetMedicalBaseModel(value, true, null)
      value?.medicalServiceIndicates.forEach(val => {
        let index = this.serviceIndicateAddition.findIndex(x => x['id'] == val);
        (index != -1) && serviceData.splice(index, 1);
        let value = this.medicalServiceIndicates.find(x => x._id == val);
        value && comboBaseModel.listIndicate.push(this.onSetMedicalBaseModel(value, true, null));
      });
      serviceData.push(comboBaseModel);
    } else {
      serviceData.splice(this.serviceIndicateAddition.findIndex(x => x.id == value._id), 1);
    }
    this.serviceIndicateAddition = [...serviceData];
    this.onLoadServiceIndicateGroup();
  }

  onSetMedicalBaseModel = (value: MedicalServiceIndicate, isCombo: boolean, comment: string): any => {
    let designat: MedicalBaseModel = new MedicalBaseModel();
    designat.name = value.name;
    designat.comment = comment;
    designat.status = OPERATOR_SERVICE_STATUS.NOT_FINISH;
    designat.id = value._id;
    designat.money = value.price;
    designat.indicater = this.staffLoginId;
    designat.totalMoney = value.price;
    designat.isCombo = isCombo;
    designat.groupIndicateShortName = value.medicalServiceIndicateGroupShortName;
    designat.indicateShortName = value.shortName;
    designat.groupIndicateName = value.tagService;
    designat.typeIndicate = value.typeIndicate;
    designat.listIndicate = [];
    return designat;
  }

  onCheckDesignat = (medicalService: MedicalServiceIndicate, onlyCombo: boolean): boolean => {
    let serviceIndicateAddition: any = [];
    this.serviceIndicateAddition.forEach(val => {
      if (val.isCombo) {
        val.listIndicate.forEach(valCombo => {
          serviceIndicateAddition.push(valCombo);
        });
      } 
      !onlyCombo && serviceIndicateAddition.push(val);
    });
    return serviceIndicateAddition?.some(x => x.id == medicalService._id);
  }

  onCheckCombo = (medicalServiceCombo: MedicalComboService): boolean => {
    let serviceIndicateAddition: any = [];
    this.serviceIndicateAddition.forEach(val => {
      if (val.isCombo) serviceIndicateAddition.push(val);
    });
    return serviceIndicateAddition?.some(x => x.id == medicalServiceCombo._id);
  }

  onChangeVal = (event) => {
    this.subject.next(event.target.value);
  }

  onRemoveServiceIndicate = (event, index) => {
    if (!event._id) {
      let serviceData = _.cloneDeep(this.serviceIndicateAddition);
      let indexService: number = this.serviceIndicateAddition?.findIndex(val => val.name == event.name);
      serviceData.splice(indexService, 1);
      this.serviceIndicateAddition = [...serviceData];
    } else {
      let serviceData = _.cloneDeep(this.serviceIndicateSelected);
      serviceData.splice(index, 1);
      this.serviceIndicateSelected = [...serviceData];
    }
    this.onLoadServiceIndicateGroup();
  }

  ngOnDestroy(): void {
  }
}

export const MEDICAL_SERVICE_INDEICATE_COLDEF: Array<ColumnDef> = [
  {
    label: 'Tên chỉ định',
    title: 'name',
    style: 'text-align: center',
    headerStyle: 'text-align: center',
  },
  {
    label: 'Giá',
    title: 'totalMoney',
    colType: 'money',
    style: 'text-align: center; width: 20%',
    headerStyle: 'text-align: center; width: 20%',
    canUpdate: true,
    fieldUpdate: 'totalMoney',
    updateType: 'money',
  },
  {
    label: 'Ghi chú',
    title: 'comment',
    style: 'text-align: center',
    headerStyle: 'text-align: center',
    canUpdate: true,
    fieldUpdate: 'comment',
  },
];
