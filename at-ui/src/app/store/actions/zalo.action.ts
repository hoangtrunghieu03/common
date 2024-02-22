import { createAction, props } from "@ngrx/store"
import ZaloInfo from '../../../../../at-common/model/ZaloInfo';
export const ZaloAction = {
  onLoadZaloCurrent: '[Zalo] load all zalo',
  onLoadZaloCurrentSuccess : '[Zalo] load all zalo success',
  onUpdateZalo: '[Zalo] update zalo',
  onAuthZalo: '[Zalo] on auth zalo',
  onAuthSuccess: '[Zalo] on auth zalo success',
}
export const onLoadZaloCurrent = createAction(ZaloAction.onLoadZaloCurrent);
export const onLoadZaloCurrentSuccess = createAction(ZaloAction.onLoadZaloCurrentSuccess,
  props<{ zalo: ZaloInfo }>()
)
export const onAuthZalo = createAction(ZaloAction.onAuthZalo,
  props<{code: string, oa_id: string}>()
);
export const onAuthZaloSuccess = createAction(ZaloAction.onAuthSuccess,
  props<{ zaloAuth: any }>()
)
export const onUpdateZalo = createAction(ZaloAction.onUpdateZalo,
  props<ZaloInfo>()
)
