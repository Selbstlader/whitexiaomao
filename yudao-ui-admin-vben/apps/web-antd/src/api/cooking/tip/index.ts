import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace CookingTipApi {
  /** 小貼士信息 */
  export interface Tip {
    id?: number;
    dishId: number;
    content: string;
    createTime?: Date;
  }

  /** 批量创建小貼士參數 */
  export interface BatchCreateTip {
    dishId: number;
    tips: {
      content: string;
    }[];
  }
}

/** 獲得烹飪小貼士 */
export function getTip(id: number) {
  return requestClient.get<CookingTipApi.Tip>(`/cooking/tip/get?id=${id}`);
}

/** 創建烹飪小貼士 */
export function createTip(data: CookingTipApi.Tip) {
  return requestClient.post('/cooking/tip/create', data);
}

/** 修改烹飪小貼士 */
export function updateTip(data: CookingTipApi.Tip) {
  return requestClient.put('/cooking/tip/update', data);
}

/** 刪除烹飪小貼士 */
export function deleteTip(id: number) {
  return requestClient.delete(`/cooking/tip/delete?id=${id}`);
}

/** 獲得指定菜品的烹飪小貼士列表 */
export function getTipListByDishId(dishId: number) {
  return requestClient.get<CookingTipApi.Tip[]>('/cooking/tip/list', { 
    params: { dishId }
  });
}

/** 批量創建烹飪小貼士 */
export function batchCreateTip(data: CookingTipApi.BatchCreateTip) {
  return requestClient.post<number[]>('/cooking/tip/batch-create', data);
} 