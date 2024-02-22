import MedicalBaseModel from '../../../../../at-common/model/MedicalBaseModel';

export interface FilterParam {
    condition: string,
    conditionSelect: string,
    value: string,
    fromDate: string,
    toDate: string,
    default?: boolean
}

export class FilterModel {
    condition: string = null;
    conditionSelect: string = null;
    secondConditionSelect?: string = null;
    value: any = null;
    fromDate: string = null;
    toDate: string = null;
    constructor(
        condition?: string,
        conditionSelect?: string,
        secondConditionSelect?: string,
        value?: string,
        fromDate?: string,
        toDate?: string,
    ){
        this.condition = condition;
        this.conditionSelect = conditionSelect;
        this.secondConditionSelect = secondConditionSelect;
        this.value = value;
        this.fromDate = fromDate;
        this.toDate = toDate;
    }
}

export interface FilterCondition {
    id: number,
    key: string,
    firstCondition: string,
    secondCondition: string,
    fromDate: string,
    toDate: string
    default?: boolean,
}

export interface ATContent {
    label: string,
    value: string | number | any
}

export interface RoomInfo {
    _id: string,
    fromRoom: string,
    toRoom: string,
    roomName?: string,
    toRoomName?: string,
    roomStatus?: string,
    noteTranfer?: string
}
export interface ImageInfor {
    _id: string,
    typeImg: string,
    url: string,
}

export class DataCustomToPrint {
    customerCode: string = null;
    address: string = null;
    medicalServiceIndicates: MedicalBaseModel[] = [];
    medicalServices: MedicalBaseModel[] = [];
    totalMoney: number = 0;
    moneyPayment: number = 0;
    discountAmount: number = 0;
    moneyPaymented: number = 0;
    moneyIncome: number = 0;
    paymentDate: Date = null;
    totalAfterDiscount: number = 0;
    staffId: string = null;
}
export class DataForwardingCustomToPrint {
    title: string = null;
    sender: { label: string, value: string } = { label: null, value: null };
    receiver: { label: string, value: string } = { label: null, value: null };
    dateDelivery: { label: string, value: string } = { label: null, value: null };
    content: { label: string, value: string } = { label: null, value: null };
}

export enum PRINT_TYPE {
    MEDICAL_RECORD = 'medical',
    FORWARDING = 'forwarding',
    INVENTORY_HISTORY = 'inventoryHistory',
    COMMITMENT = 'commitment',
}