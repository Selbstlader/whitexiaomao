import type { PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace DoubanCommentApi {
  /** 评论信息 */
  export interface Comment {
    id?: number;
    movieId: number;
    userId: number;
    content: string;
    rating: number;
    status: number;
    createTime?: string;
    updateTime?: string;
    movieTitle?: string;
    username?: string;
    userNickname?: string;
  }

  /** 评论分页查询请求 */
  export interface CommentPageReq {
    pageNo: number;
    pageSize: number;
    movieId?: number;
    userId?: number;
    status?: number;
    content?: string;
    movieTitle?: string;
    username?: string;
  }

  /** 评论创建请求 */
  export interface CommentCreateReq {
    movieId: number;
    userId: number;
    content: string;
    rating: number;
    status?: number;
  }

  /** 评论更新请求 */
  export interface CommentUpdateReq {
    id: number;
    content: string;
    rating: number;
    status: number;
  }

  /** 评论审核请求 */
  export interface CommentAuditReq {
    id: number;
    status: number;
    auditReason?: string;
  }

  /** 批量审核请求 */
  export interface CommentBatchAuditReq {
    ids: number[];
    status: number;
    auditReason?: string;
  }

  /** 评论统计信息 */
  export interface CommentStats {
    totalCount: number;
    pendingCount: number;
    approvedCount: number;
    rejectedCount: number;
    todayCount: number;
  }
}

/**
 * 获取评论分页列表
 */
export function getCommentPage(params: DoubanCommentApi.CommentPageReq) {
  return requestClient.get<PageResult<DoubanCommentApi.Comment>>('/douban/comment/page', {
    params,
  });
}

/**
 * 获取评论详情
 */
export function getComment(id: number) {
  return requestClient.get<DoubanCommentApi.Comment>(`/douban/comment/get?id=${id}`);
}

/**
 * 创建评论
 */
export function createComment(data: DoubanCommentApi.CommentCreateReq) {
  return requestClient.post('/douban/comment/create', data);
}

/**
 * 更新评论
 */
export function updateComment(data: DoubanCommentApi.CommentUpdateReq) {
  return requestClient.put('/douban/comment/update', data);
}

/**
 * 删除评论
 */
export function deleteComment(id: number) {
  return requestClient.delete(`/douban/comment/delete?id=${id}`);
}

/**
 * 审核评论
 */
export function auditComment(data: DoubanCommentApi.CommentAuditReq) {
  return requestClient.put('/douban/comment/audit', data);
}

/**
 * 批量审核评论
 */
export function batchAuditComments(data: DoubanCommentApi.CommentBatchAuditReq) {
  return requestClient.put('/douban/comment/batch-audit', data);
}

/**
 * 获取评论统计信息
 */
export function getCommentStats() {
  return requestClient.get<DoubanCommentApi.CommentStats>('/douban/comment/stats');
}

/**
 * 导出评论数据
 */
export function exportComment(params: DoubanCommentApi.CommentPageReq) {
  return requestClient.download('/douban/comment/export', {
    params,
  });
}