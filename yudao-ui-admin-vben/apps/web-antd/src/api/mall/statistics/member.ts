import type { MallDataComparisonRespVO } from './common';

import { formatDate } from '@vben/utils';

import { requestClient } from '#/api/request';

export namespace MallMemberStatisticsApi {
  /** 会员分析 Request VO */
  export interface AnalyseReq {
    times: Date[];
  }

  /** 会员分析对照数据 Response VO */
  export interface AnalyseComparison {
    registerUserCount: number;
    visitUserCount: number;
    rechargeUserCount: number;
  }

  /** 会员分析 Response VO */
  export interface Analyse {
    visitUserCount: number;
    orderUserCount: number;
    payUserCount: number;
    atv: number;
    comparison: MallDataComparisonRespVO<AnalyseComparison>;
  }

  /** 会员地区统计 Response VO */
  export interface AreaStatistics {
    areaId: number;
    areaName: string;
    userCount: number;
    orderCreateUserCount: number;
    orderPayUserCount: number;
    orderPayPrice: number;
  }

  /** 会员性别统计 Response VO */
  export interface SexStatistics {
    sex: number;
    userCount: number;
  }

  /** 会员统计 Response VO */
  export interface Summary {
    userCount: number;
    rechargeUserCount: number;
    rechargePrice: number;
    expensePrice: number;
  }

  /** 会员终端统计 Response VO */
  export interface TerminalStatistics {
    terminal: number;
    userCount: number;
  }

  /** 会员数量统计 Response VO */
  export interface Count {
    /** 用户访问量 */
    visitUserCount: string;
    /** 注册用户数量 */
    registerUserCount: number;
  }

  /** 会员注册数量 Response VO */
  export interface RegisterCount {
    date: string;
    count: number;
  }
}

/** 查询会员统计 */
export function getMemberSummary() {
  return requestClient.get<MallMemberStatisticsApi.Summary>(
    '/statistics/member/summary',
  );
}

/** 查询会员分析数据 */
export function getMemberAnalyse(params: MallMemberStatisticsApi.AnalyseReq) {
  return requestClient.get<MallMemberStatisticsApi.Analyse>(
    '/statistics/member/analyse',
    {
      params: {
        times: [formatDate(params.times[0]), formatDate(params.times[1])],
      },
    },
  );
}

/** 按照省份，查询会员统计列表 */
export function getMemberAreaStatisticsList() {
  return requestClient.get<MallMemberStatisticsApi.AreaStatistics[]>(
    '/statistics/member/area-statistics-list',
  );
}

/** 按照性别，查询会员统计列表 */
export function getMemberSexStatisticsList() {
  return requestClient.get<MallMemberStatisticsApi.SexStatistics[]>(
    '/statistics/member/sex-statistics-list',
  );
}

/** 按照终端，查询会员统计列表 */
export function getMemberTerminalStatisticsList() {
  return requestClient.get<MallMemberStatisticsApi.TerminalStatistics[]>(
    '/statistics/member/terminal-statistics-list',
  );
}

/** 获得用户数量量对照 */
export function getUserCountComparison() {
  return requestClient.get<
    MallDataComparisonRespVO<MallMemberStatisticsApi.Count>
  >('/statistics/member/user-count-comparison');
}

/** 获得会员注册数量列表 */
export function getMemberRegisterCountList(beginTime: Date, endTime: Date) {
  return requestClient.get<MallMemberStatisticsApi.RegisterCount[]>(
    '/statistics/member/register-count-list',
    {
      params: {
        times: [formatDate(beginTime), formatDate(endTime)],
      },
    },
  );
}
