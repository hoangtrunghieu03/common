import { createAction, props } from "@ngrx/store";
import Chair from '../../../../../at-common/model/Chair';

export const ChairAction = {
    onLoadChair: '[Chair] load all chair',
    onLoadChairSuccess: '[Chair] load all chair successfully',

    onCreateChair: '[Chair] create chair',
    onUpdateChair: '[Chair] update chair',
    onRemoveChair: '[Chair] remove chair',
    onResetChair: '[Chair] reset chair',
    onUpdateCustomerInChair: '[Chair] update customer in chair',

    onLoadChairById: '[Chair] load chair by id',
    onLoadChairByIdSuccess: '[Chair] load chair by id successfully',

    onLoadChairByStaff: '[Chair] load chair by staff',
    onLoadChairByStaffSuccess: '[Chair] load chair by staff successfully'
}

export const onLoadChair = createAction(ChairAction.onLoadChair);
export const onLoadChairSuccess = createAction(ChairAction.onLoadChairSuccess,
    props<{ chair: Chair[] }>()
)

export const onCreateChair = createAction(ChairAction.onCreateChair,
    props<Chair>()
);
export const onUpdateChair = createAction(ChairAction.onUpdateChair,
    props<Chair>()
);
export const onRemoveChair = createAction(ChairAction.onRemoveChair,
    props<Chair>()
);
export const onResetChair = createAction(ChairAction.onResetChair,
    props<{ _id: string }>()
);

export const onLoadChairById = createAction(ChairAction.onLoadChairById,
    props<{ _id: string }>()
);
export const onLoadChairByIdSuccess = createAction(ChairAction.onLoadChairByIdSuccess,
    props<Chair>()
)
export const onLoadChairByStaff = createAction(ChairAction.onLoadChairByStaff);
export const onLoadChairByStaffSuccess = createAction(ChairAction.onLoadChairByStaffSuccess,
    props<{ chair: Chair }>()
)
export const onUpdateCustomerInChair = createAction(ChairAction.onUpdateCustomerInChair,
    props<{ _id: string, chair: any }>()
)