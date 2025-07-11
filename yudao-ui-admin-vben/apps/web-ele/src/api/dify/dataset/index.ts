import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace DifyDatasetApi {
  /** 知识库信息 */
  export interface Dataset {
    id?: string;
    name: string;
    description?: string;
    permission: string;
    dataSourceType?: string;
    indexingTechnique?: string;
    appCount?: number;
    documentCount?: number;
    wordCount?: number;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
  }

  /** 知识库查询参数 */
  export interface DatasetPageReqVO extends PageParam {
    name?: string;
    permission?: string;
    dataSourceType?: string;
  }
}

/** 查询知识库列表 */
export function getDatasetList(params?: DifyDatasetApi.DatasetPageReqVO) {
  return requestClient.get<PageResult<DifyDatasetApi.Dataset>>(
    '/dify/dataset/list',
    { params },
  );
}

/** 查询知识库详情 */
export function getDataset(id: string) {
  return requestClient.get<DifyDatasetApi.Dataset>(
    `/dify/dataset/get?id=${id}`,
  );
}

/** 新增知识库 */
export function createDataset(data: DifyDatasetApi.Dataset) {
  return requestClient.post('/dify/dataset/create', data);
}

/** 修改知识库 */
export function updateDataset(data: DifyDatasetApi.Dataset) {
  return requestClient.put('/dify/dataset/update', data);
}

/** 删除知识库 */
export function deleteDataset(id: string) {
  return requestClient.delete(`/dify/dataset/delete?id=${id}`);
}

/** 导出知识库 */
export function exportDataset(params?: DifyDatasetApi.DatasetPageReqVO) {
  return requestClient.download('/dify/dataset/export-excel', { params });
}
