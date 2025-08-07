import type { PageResult } from '@vben/request';

import { requestClient } from '#/api/request';

export namespace DoubanMovieApi {
  /** 电影信息 */
  export interface Movie {
    id?: number;
    title: string;
    director: string;
    actors?: string;
    year: number;
    genre?: string;
    rating?: number;
    poster?: string;
    summary?: string;
    createTime?: string;
    updateTime?: string;
  }

  /** 电影分页查询请求 */
  export interface MoviePageReq {
    pageNo: number;
    pageSize: number;
    title?: string;
    director?: string;
    year?: number;
  }

  /** 电影创建请求 */
  export interface MovieCreateReq {
    title: string;
    director: string;
    actors?: string;
    year: number;
    genre?: string;
    rating?: number;
    poster?: string;
    summary?: string;
  }

  /** 电影更新请求 */
  export interface MovieUpdateReq {
    id: number;
    title: string;
    director: string;
    actors?: string;
    year: number;
    genre?: string;
    rating?: number;
    poster?: string;
    summary?: string;
  }
}

/**
 * 获取电影分页列表
 */
export function getMoviePage(params: DoubanMovieApi.MoviePageReq) {
  return requestClient.get<PageResult<DoubanMovieApi.Movie>>('/douban/movie/page', {
    params,
  });
}

/**
 * 获取电影详情
 */
export function getMovie(id: number) {
  return requestClient.get<DoubanMovieApi.Movie>(`/douban/movie/get?id=${id}`);
}

/**
 * 创建电影
 */
export function createMovie(data: DoubanMovieApi.MovieCreateReq) {
  return requestClient.post('/douban/movie/create', data);
}

/**
 * 更新电影
 */
export function updateMovie(data: DoubanMovieApi.MovieUpdateReq) {
  return requestClient.put('/douban/movie/update', data);
}

/**
 * 删除电影
 */
export function deleteMovie(id: number) {
  return requestClient.delete(`/douban/movie/delete?id=${id}`);
}

/**
 * 导出电影数据
 */
export function exportMovie(params: DoubanMovieApi.MoviePageReq) {
  return requestClient.download('/douban/movie/export', {
    params,
  });
}