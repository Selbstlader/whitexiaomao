import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace CookingDishApi {
  /** 菜品信息 */
  export interface Dish {
    id?: number;
    categoryId: number;
    name: string;
    description?: string;
    imageName?: string;
    difficulty: number;
    cookingTime: number;
    createTime?: Date;
    categoryName?: string;
    imageFile?: File;
  }

  /** 菜品詳情 */
  export interface DishDetail extends Dish {
    ingredients: any[];
    steps: any[];
    tips: any[];
    averageStarRating: number;
  }

  /** 菜品簡單信息 */
  export interface SimpleDish {
    id?: number;
    name: string;
    categoryId: number;
    difficulty: number;
  }
}

/** 查詢菜品分頁 */
export function getDishPage(params: PageParam) {
  return requestClient.get<PageResult<CookingDishApi.Dish>>(
    '/cooking/dish/page',
    { params },
  );
}

/** 查詢菜品詳情 */
export function getDish(id: number) {
  return requestClient.get<CookingDishApi.Dish>(`/cooking/dish/get?id=${id}`);
}

/** 查詢菜品完整詳情 */
export function getDishDetail(id: number) {
  return requestClient.get<CookingDishApi.DishDetail>(`/cooking/dish/detail?id=${id}`);
}

/** 新增菜品 */
export function createDish(data: FormData) {
  return requestClient.post('/cooking/dish/create', data);
}

/** 修改菜品 */
export function updateDish(data: FormData) {
  // 直接使用 FormData，後端已經修改為 @RequestBody 接收
  return requestClient.put('/cooking/dish/update', data);
}

/** 刪除菜品 */
export function deleteDish(id: number) {
  return requestClient.delete(`/cooking/dish/delete?id=${id}`);
}

/** 獲取所有菜品精簡列表 */
export function getSimpleDishList() {
  return requestClient.get<CookingDishApi.SimpleDish[]>('/cooking/dish/list-all-simple');
} 