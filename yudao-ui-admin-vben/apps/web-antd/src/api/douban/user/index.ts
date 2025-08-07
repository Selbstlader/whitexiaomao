import type { PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace DoubanUserApi {
  /** 豆瓣用户信息 */
  export interface User {
    id?: number;
    username: string;
    nickname: string;
    email: string;
    avatar?: string;
    status: number;
    remark?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 用户分页查询请求 */
  export interface UserPageReq {
    pageNo: number;
    pageSize: number;
    username?: string;
    nickname?: string;
    email?: string;
    status?: number;
  }

  /** 用户创建请求 */
  export interface UserCreateReq {
    username: string;
    nickname: string;
    email: string;
    avatar?: string;
    status: number;
    remark?: string;
  }

  /** 用户更新请求 */
  export interface UserUpdateReq {
    id: number;
    username: string;
    nickname: string;
    email: string;
    avatar?: string;
    status: number;
    remark?: string;
  }

  /** 用户状态更新请求 */
  export interface UserStatusUpdateReq {
    id: number;
    status: number;
  }

  /** 重置密码请求 */
  export interface ResetPasswordReq {
    id: number;
    password: string;
  }
}

/**
 * 获取用户分页列表
 */
export function getUserPage(params: DoubanUserApi.UserPageReq) {
  return requestClient.get<PageResult<DoubanUserApi.User>>('/douban/user/page', {
    params,
  });
}

/**
 * 获取用户详情
 */
export function getUser(id: number) {
  return requestClient.get<DoubanUserApi.User>(`/douban/user/get?id=${id}`);
}

/**
 * 创建用户
 */
export function createUser(data: DoubanUserApi.UserCreateReq) {
  return requestClient.post('/douban/user/create', data);
}

/**
 * 更新用户
 */
export function updateUser(data: DoubanUserApi.UserUpdateReq) {
  return requestClient.put('/douban/user/update', data);
}

/**
 * 删除用户
 */
export function deleteUser(id: number) {
  return requestClient.delete(`/douban/user/delete?id=${id}`);
}

/**
 * 更新用户状态
 */
export function updateUserStatus(data: DoubanUserApi.UserStatusUpdateReq) {
  return requestClient.put('/douban/user/update-status', data);
}

/**
 * 导出用户数据
 */
export function exportUser(params: DoubanUserApi.UserPageReq) {
  return requestClient.download('/douban/user/export', {
    params,
  });
}

/**
 * 重置用户密码
 */
export function resetUserPassword(data: DoubanUserApi.ResetPasswordReq) {
  return requestClient.put('/douban/user/reset-password', data);
}