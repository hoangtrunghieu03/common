import { createAction, props } from "@ngrx/store";
import ReportRevenue from "../../../../../at-common/model/ReportRevenue";
import ReportSupply from "../../../../../at-common/model/ReportSupply";

export const ReportAction = {
    onLoadReportRevenueGeneral: '[Report] load report revenue general',
    onLoadReportRevenueGeneralSuccess: '[Report] load report revenue general successfully',

    onLoadReportRevenueGeneralDetail: '[Report] load report revenue general detail',
    onLoadReportRevenueGeneralDetailSuccess: '[Report] load report revenue general detail successfully',

    onLoadReportStaffs: '[Report] load report staffs',
    onLoadReportStaffsSuccess: '[Report] load report staffs successfully',

    onLoadReportStaffDetail: '[Report] load report staff detail',
    onLoadReportStaffDetailSuccess: '[Report] load report staff detail successfully',

    onLoadReportSupplyInventory: '[Report] load report supply inventory',
    onLoadReportSupplyInventorySuccess: '[Report] load report supply inventory successfully',

    onLoadReportSupplyInventoryByRoom: '[Report] load report supply inventory by room',
    onLoadReportSupplyInventoryByRoomSuccess: '[Report] load report supply inventory by room successfully',

    onLoadReportSupplyInventoryByRoomDetail: '[Report] load report supply inventory by room detail',
    onLoadReportSupplyInventoryByRoomDetailSuccess: '[Report] load report supply inventory by room successfully detail',

    onLoadServiceRevenue: '[Service] Load Service Revenue',
    onLoadServiceRevenueSuccess: '[Service] Load Service Revenue Successfully',

    onLoadReportRoom: '[Report] load report room',
    onLoadReportRoomSuccess: '[Report] load report room successfully',
}

export const onLoadReportRevenueGeneral = createAction(ReportAction.onLoadReportRevenueGeneral,
    props<ReportRevenue>());
export const onLoadReportRevenueGeneralSuccess = createAction(ReportAction.onLoadReportRevenueGeneralSuccess,
    props<{ reportGeneral: ReportRevenue[] }>()
)

export const onLoadReportRevenueGeneralDetail = createAction(ReportAction.onLoadReportRevenueGeneralDetail,
    props<ReportRevenue>());
export const onLoadReportRevenueGeneralDetailSuccess = createAction(ReportAction.onLoadReportRevenueGeneralDetailSuccess,
    props<{ reportGeneralDetail: ReportRevenue[] }>()
)

export const onLoadReportStaffs = createAction(ReportAction.onLoadReportStaffs,
    props<ReportRevenue>());
export const onLoadReportStaffsSuccess = createAction(ReportAction.onLoadReportStaffsSuccess,
    props<{ reportStaffs: ReportRevenue[] }>()
)

export const onLoadReportStaffDetail = createAction(ReportAction.onLoadReportStaffDetail,
    props<ReportRevenue>());
export const onLoadReportStaffDetailSuccess = createAction(ReportAction.onLoadReportStaffDetailSuccess,
    props<{ reportStaffs: ReportRevenue[] }>()
)

export const onLoadReportSupplyInventory = createAction(ReportAction.onLoadReportSupplyInventory,
    props<ReportSupply>());
export const onLoadReportSupplyInventorySuccess = createAction(ReportAction.onLoadReportSupplyInventorySuccess,
    props<{ reportInventory: ReportSupply[] }>()
)

export const onLoadReportSupplyInventoryByRoom = createAction(ReportAction.onLoadReportSupplyInventoryByRoom,
  props<ReportSupply>());
export const onLoadReportSupplyInventoryByRoomSuccess = createAction(ReportAction.onLoadReportSupplyInventoryByRoomSuccess,
  props<{ reportInventory: ReportSupply[] }>()
)

export const onLoadReportSupplyInventoryByRoomDetail = createAction(ReportAction.onLoadReportSupplyInventoryByRoomDetail,
  props<ReportSupply>());
export const onLoadReportSupplyInventoryByRoomDetailSuccess = createAction(ReportAction.onLoadReportSupplyInventoryByRoomDetailSuccess,
  props<{ reportInventoryDetail: ReportSupply[] }>()
)

export const onLoadServiceRevenue = createAction(ReportAction.onLoadServiceRevenue,
    props<ReportRevenue>());
export const onLoadServiceRevenueSuccess = createAction(ReportAction.onLoadServiceRevenueSuccess,
    props<{ revenueService: ReportRevenue[] }>()
)

export const onLoadReportRoom = createAction(ReportAction.onLoadReportRoom,
    props<ReportRevenue>());
export const onLoadReportRoomSuccess = createAction(ReportAction.onLoadReportRoomSuccess,
    props<{ rooms: ReportRevenue[] }>()
)
