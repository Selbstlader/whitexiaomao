import type { PageParam, PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace DifyDocumentApi {
  /** 文档信息 */
  export interface Document {
    id: string;
    name: string;
    position: number;
    tokens: number;
    error?: string;
    enabled: boolean;
    archived: boolean;
    data_source_type: string;
    data_source_info: any;
    dataset_process_rule_id: string;
    created_from: string;
    created_by: string;
    created_at: number;
    indexing_status: string;
    disabled_at?: number;
    disabled_by?: string;
    display_status: string;
    word_count: number;
    hit_count: number;
    doc_form: string;
  }

  /** 文档查询参数 */
  export interface DocumentPageReqVO extends PageParam {
    datasetId: string;
    keyword?: string;
    enabled?: boolean;
  }

  /** 文档创建参数 */
  export interface DocumentCreateReqVO {
    datasetId: string;
    name: string;
    text?: string;
    file?: File;
    dataSourceType: string;
    dataSourceInfo?: any;
    indexingTechnique?: string;
    processingRule?: any;
  }

  /** 文档更新参数 */
  export interface DocumentUpdateReqVO {
    id: string;
    name?: string;
    enabled?: boolean;
  }
}

/** 查询文档列表 */
export function getDocumentList(params: DifyDocumentApi.DocumentPageReqVO) {
  return requestClient.get<{ code: number; data: DifyDocumentApi.Document[]; msg: string }>(
    `/dify/dataset/${params.datasetId}/documents`,
    { params: { pageNo: params.pageNo, pageSize: params.pageSize, keyword: params.keyword, enabled: params.enabled } },
  ).then(response => {
    // 转换为标准的分页格式
    return {
      list: response || [],
      total: response?.length || 0,
    };
  });
}

/** 查询文档详情 */
export function getDocument(datasetId: string, documentId: string) {
  return requestClient.get<DifyDocumentApi.Document>(
    `/dify/dataset/${datasetId}/documents/${documentId}`,
  );
}

/** 新增文档 */
export function createDocument(data: DifyDocumentApi.DocumentCreateReqVO) {
  return requestClient.post(`/dify/dataset/${data.datasetId}/documents`, data);
}

/** 通过文件创建文档 */
export function createDocumentByFile(datasetId: string, file: File, name?: string) {
  const formData = new FormData();
  formData.append('file', file);
  if (name) {
    formData.append('name', name);
  }

  return requestClient.post<{ code: number; data: DifyDocumentApi.Document; msg: string }>(
    `/dify/dataset/${datasetId}/document/create-by-file`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
}

/** 修改文档 */
export function updateDocument(datasetId: string, data: DifyDocumentApi.DocumentUpdateReqVO) {
  return requestClient.put(`/dify/dataset/${datasetId}/documents/${data.id}`, data);
}

/** 删除文档 */
export function deleteDocument(datasetId: string, documentId: string) {
  return requestClient.delete(`/dify/dataset/${datasetId}/document/${documentId}`);
}

/** 启用/禁用文档 */
export function toggleDocumentStatus(datasetId: string, documentId: string, enabled: boolean) {
  return requestClient.put(`/dify/dataset/${datasetId}/documents/${documentId}/status`, { enabled });
}

/** 重新处理文档 */
export function reprocessDocument(datasetId: string, documentId: string) {
  return requestClient.post(`/dify/dataset/${datasetId}/documents/${documentId}/reprocess`);
}

/** 导出文档 */
export function exportDocuments(params: DifyDocumentApi.DocumentPageReqVO) {
  return requestClient.download(`/dify/dataset/${params.datasetId}/documents/export-excel`, { params });
}
