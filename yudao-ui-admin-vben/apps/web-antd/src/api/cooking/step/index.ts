import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace CookingStepApi {
  /** 步驟信息 */
  export interface Step {
    id?: number;
    dishId: number;
    stepNumber: number;
    description: string;
    imageName?: string;
    imageUrl?: string;
    createTime?: Date;
  }

  /** 批量创建步驟參數 */
  export interface BatchCreateStep {
    dishId: number;
    steps: {
      stepNumber: number;
      description: string;
    }[];
  }
}

/** 獲得烹飪步驟 */
export function getStep(id: number) {
  return requestClient.get<CookingStepApi.Step>(`/cooking/step/get?id=${id}`);
}

/** 創建烹飪步驟 */
export function createStep(data: FormData) {
  return requestClient.post('/cooking/step/create', data);
}

/** 修改烹飪步驟 */
export function updateStep(data: FormData) {
  return requestClient.put('/cooking/step/update', data);
}

/** 刪除烹飪步驟 */
export function deleteStep(id: number) {
  return requestClient.delete(`/cooking/step/delete?id=${id}`);
}

/** 獲得指定菜品的烹飪步驟列表 */
export function getStepListByDishId(dishId: number) {
  return requestClient.get<CookingStepApi.Step[]>('/cooking/step/list', { 
    params: { dishId }
  });
}

/** 批量創建烹飪步驟 */
export function batchCreateStep(data: CookingStepApi.BatchCreateStep) {
  return requestClient.post<number[]>('/cooking/step/batch-create', data);
} 