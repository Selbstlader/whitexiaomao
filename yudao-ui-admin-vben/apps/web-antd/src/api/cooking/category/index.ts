import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace CookingCategoryApi {
  /** 菜品分類信息 */
  export interface Category {
    id?: number;
    name: string;
    createTime?: Date;
  }
}

/** 查詢菜品分類分頁 */
export function getCategoryPage(params: PageParam) {
  return requestClient.get<PageResult<CookingCategoryApi.Category>>(
    '/cooking/category/page',
    { params },
  );
}

/** 查詢菜品分類詳情 */
export function getCategory(id: number) {
  return requestClient.get<CookingCategoryApi.Category>(`/cooking/category/get?id=${id}`);
}

/** 新增菜品分類 */
export function createCategory(data: CookingCategoryApi.Category) {
  return requestClient.post('/cooking/category/create', data);
}

/** 修改菜品分類 */
export function updateCategory(data: CookingCategoryApi.Category) {
  return requestClient.put('/cooking/category/update', data);
}

/** 刪除菜品分類 */
export function deleteCategory(id: number) {
  return requestClient.delete(`/cooking/category/delete?id=${id}`);
}

/** 獲取所有菜品分類精簡列表 */
export function getSimpleCategoryList() {
  return requestClient.get<CookingCategoryApi.Category[]>('/cooking/category/list-all-simple');
} 