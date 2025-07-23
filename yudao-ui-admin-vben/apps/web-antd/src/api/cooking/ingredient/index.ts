import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace CookingIngredientApi {
  /** 配料信息 */
  export interface Ingredient {
    id?: number;
    dishId: number;
    name: string;
    amount: string;
    createTime?: Date;
  }

  /** 批量创建配料参数 */
  export interface BatchCreateIngredient {
    dishId: number;
    ingredients: {
      name: string;
      amount: string;
    }[];
  }
}

/** 獲得配料 */
export function getIngredient(id: number) {
  return requestClient.get<CookingIngredientApi.Ingredient>(`/cooking/ingredient/get?id=${id}`);
}

/** 創建配料 */
export function createIngredient(data: CookingIngredientApi.Ingredient) {
  return requestClient.post('/cooking/ingredient/create', data);
}

/** 修改配料 */
export function updateIngredient(data: CookingIngredientApi.Ingredient) {
  return requestClient.put('/cooking/ingredient/update', data);
}

/** 刪除配料 */
export function deleteIngredient(id: number) {
  return requestClient.delete(`/cooking/ingredient/delete?id=${id}`);
}

/** 獲得指定菜品的配料列表 */
export function getIngredientListByDishId(dishId: number) {
  return requestClient.get<CookingIngredientApi.Ingredient[]>('/cooking/ingredient/list', { 
    params: { dishId }
  });
}

/** 批量創建配料 */
export function batchCreateIngredient(data: CookingIngredientApi.BatchCreateIngredient) {
  return requestClient.post<number[]>('/cooking/ingredient/batch-create', data);
} 