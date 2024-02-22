import { onLoadReportSupplyInventoryByRoomDetail } from './../actions/report.action';
import { Action } from '@ngrx/store';
import ReportRevenue from '../../../../../at-common/model/ReportRevenue';
import { onLoadReportRevenueGeneral, onLoadReportRevenueGeneralSuccess, onLoadReportRoom, onLoadReportRoomSuccess, onLoadReportStaffDetail, onLoadReportStaffDetailSuccess, onLoadReportStaffs, onLoadReportStaffsSuccess, onLoadReportSupplyInventory, onLoadReportSupplyInventorySuccess, onLoadServiceRevenue, onLoadServiceRevenueSuccess, onLoadReportRevenueGeneralDetail, onLoadReportRevenueGeneralDetailSuccess, onLoadReportSupplyInventoryByRoom, onLoadReportSupplyInventoryByRoomSuccess, onLoadReportSupplyInventoryByRoomDetailSuccess } from '../actions/report.action';
import { ReportState } from '../entities/state.entity';
import { createReducer, on } from '../utils/store.util';

const initialState: ReportState = {
    generals: null,
    generalDetail: null,
    staffs: null,
    staffDetail: null,
    inventory: null,
    inventoryByRoom: null,
    roomDetails: null,
    rooms: null,
    message: '',
    serviceRevenues:null,
};

export const reducer = createReducer(
    initialState,
    on(onLoadReportRevenueGeneral, (state, action) => ({
        ...state
    })),
    on(onLoadReportRevenueGeneralSuccess, (state, action) => ({
        ...state,
        generals: action.reportGeneral
    })),
    on(onLoadReportRevenueGeneralDetail, (state, action) => ({
        ...state
    })),
    on(onLoadReportRevenueGeneralDetailSuccess, (state, action) => ({
        ...state,
        generalDetail: action.reportGeneralDetail
    })),
    on(onLoadReportStaffs, (state, action) => ({
        ...state
    })),
    on(onLoadReportStaffsSuccess, (state, action) => ({
        ...state,
        staffs: action.reportStaffs
    })),
    on(onLoadReportStaffDetail, (state, action) => ({
        ...state
    })),
    on(onLoadReportStaffDetailSuccess, (state, action) => ({
        ...state,
        staffDetail: action.reportStaffs
    })),
    on(onLoadReportStaffDetail, (state, action) => ({
      ...state
  })),
  on(onLoadReportSupplyInventoryByRoomDetailSuccess, (state, action) => ({
      ...state,
      roomDetails: action.reportInventoryDetail
  })),
    on(onLoadReportSupplyInventoryByRoomDetail, (state, action) => ({
        ...state
    })),
    on(onLoadReportSupplyInventorySuccess, (state, action) => ({
        ...state,
        inventory: action.reportInventory
    })),
    on(onLoadReportSupplyInventoryByRoom, (state, action) => ({
      ...state
  })),
  on(onLoadReportSupplyInventoryByRoomSuccess, (state, action) => ({
      ...state,
      inventoryByRoom: action.reportInventory
  })),
    on(onLoadServiceRevenue, (state, action) => ({
        ...state
    })),
    on(onLoadServiceRevenueSuccess, (state, action) => ({
        ...state,
        serviceRevenues: action.revenueService
    })),
    on(onLoadReportRoom, (state, action) => ({
        ...state
    })),
    on(onLoadReportRoomSuccess, (state, action) => ({
        ...state,
        rooms: action.rooms
    })),
);

export function reportReducer(state: ReportState | undefined, action: Action) {
    return reducer(state, action);
}
