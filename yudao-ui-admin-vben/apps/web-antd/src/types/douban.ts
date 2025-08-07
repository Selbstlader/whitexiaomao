/**
 * 豆瓣模块相关类型定义
 */

/** 电影状态枚举 */
export enum MovieStatus {
  /** 正常 */
  NORMAL = 0,
  /** 禁用 */
  DISABLED = 1,
}

/** 豆瓣电影状态枚举 */
export enum DoubanMovieStatus {
  /** 激活 */
  ACTIVE = 0,
  /** 禁用 */
  DISABLED = 1,
}

/** 豆瓣电影类型枚举 */
export enum DoubanMovieType {
  ACTION = '动作',
  COMEDY = '喜剧',
  DRAMA = '剧情',
  HORROR = '恐怖',
  ROMANCE = '爱情',
  THRILLER = '惊悚',
  SCIENCE_FICTION = '科幻',
  FANTASY = '奇幻',
  ANIMATION = '动画',
  DOCUMENTARY = '纪录片',
}

/** 用户状态枚举 */
export enum UserStatus {
  /** 正常 */
  NORMAL = 0,
  /** 禁用 */
  DISABLED = 1,
}

/** 评论状态枚举 */
export enum CommentStatus {
  /** 待审核 */
  PENDING = 0,
  /** 已通过 */
  APPROVED = 1,
  /** 已拒绝 */
  REJECTED = 2,
}

/** 电影类型枚举 */
export enum MovieGenre {
  ACTION = '动作',
  COMEDY = '喜剧',
  DRAMA = '剧情',
  HORROR = '恐怖',
  ROMANCE = '爱情',
  THRILLER = '惊悚',
  SCIENCE_FICTION = '科幻',
  FANTASY = '奇幻',
  ANIMATION = '动画',
  DOCUMENTARY = '纪录片',
  CRIME = '犯罪',
  ADVENTURE = '冒险',
  FAMILY = '家庭',
  MYSTERY = '悬疑',
  WAR = '战争',
  WESTERN = '西部',
  MUSICAL = '音乐',
  BIOGRAPHY = '传记',
  HISTORY = '历史',
  SPORT = '运动',
}

/** 评分范围 */
export const RATING_RANGE = {
  MIN: 0,
  MAX: 10,
} as const;

/** 豆瓣模块常量 */
export const DOUBAN_CONSTANTS = {
  /** 默认分页大小 */
  DEFAULT_PAGE_SIZE: 10,
  /** 最大分页大小 */
  MAX_PAGE_SIZE: 100,
  /** 电影标题最大长度 */
  MOVIE_TITLE_MAX_LENGTH: 100,
  /** 用户名最大长度 */
  USERNAME_MAX_LENGTH: 50,
  /** 评论内容最大长度 */
  COMMENT_CONTENT_MAX_LENGTH: 1000,
  /** 海报URL最大长度 */
  POSTER_URL_MAX_LENGTH: 500,
  /** 剧情简介最大长度 */
  SUMMARY_MAX_LENGTH: 2000,
} as const;

/** 状态选项 */
export const STATUS_OPTIONS = [
  { label: '正常', value: 0, color: 'success' },
  { label: '禁用', value: 1, color: 'error' },
] as const;

/** 评论状态选项 */
export const COMMENT_STATUS_OPTIONS = [
  { label: '待审核', value: 0, color: 'warning' },
  { label: '已通过', value: 1, color: 'success' },
  { label: '已拒绝', value: 2, color: 'error' },
] as const;

/** 电影类型选项 */
export const MOVIE_GENRE_OPTIONS = Object.entries(MovieGenre).map(([key, value]) => ({
  label: value,
  value: value,
}));

/** 年份选项生成函数 */
export function generateYearOptions(startYear = 1900, endYear = new Date().getFullYear()) {
  const years = [];
  for (let year = endYear; year >= startYear; year--) {
    years.push({ label: year.toString(), value: year });
  }
  return years;
}

/** 评分选项 */
export const RATING_OPTIONS = Array.from({ length: 11 }, (_, i) => ({
  label: i.toString(),
  value: i,
}));

/** 表格列宽配置 */
export const TABLE_COLUMN_WIDTHS = {
  ID: 80,
  TITLE: 200,
  DIRECTOR: 120,
  YEAR: 80,
  RATING: 80,
  STATUS: 80,
  USERNAME: 120,
  EMAIL: 180,
  CONTENT: 300,
  CREATE_TIME: 160,
  ACTIONS: 150,
} as const;

/** 表单验证规则 */
export const FORM_RULES = {
  REQUIRED: { required: true, message: '此字段为必填项' },
  EMAIL: {
    type: 'email' as const,
    message: '请输入正确的邮箱格式',
  },
  MOVIE_TITLE: {
    max: DOUBAN_CONSTANTS.MOVIE_TITLE_MAX_LENGTH,
    message: `电影标题不能超过${DOUBAN_CONSTANTS.MOVIE_TITLE_MAX_LENGTH}个字符`,
  },
  USERNAME: {
    max: DOUBAN_CONSTANTS.USERNAME_MAX_LENGTH,
    message: `用户名不能超过${DOUBAN_CONSTANTS.USERNAME_MAX_LENGTH}个字符`,
  },
  COMMENT_CONTENT: {
    max: DOUBAN_CONSTANTS.COMMENT_CONTENT_MAX_LENGTH,
    message: `评论内容不能超过${DOUBAN_CONSTANTS.COMMENT_CONTENT_MAX_LENGTH}个字符`,
  },
  RATING: {
    type: 'number' as const,
    min: RATING_RANGE.MIN,
    max: RATING_RANGE.MAX,
    message: `评分必须在${RATING_RANGE.MIN}-${RATING_RANGE.MAX}之间`,
  },
  YEAR: {
    type: 'number' as const,
    min: 1900,
    max: new Date().getFullYear() + 5,
    message: '请输入有效的年份',
  },
} as const;

/** 豆瓣电影状态选项 */
export const DOUBAN_MOVIE_STATUS_OPTIONS = [
  { label: '激活', value: DoubanMovieStatus.ACTIVE, color: 'success' },
  { label: '禁用', value: DoubanMovieStatus.DISABLED, color: 'error' },
] as const;

/** 豆瓣电影类型选项 */
export const DOUBAN_MOVIE_TYPE_OPTIONS = Object.entries(DoubanMovieType).map(([key, value]) => ({
  label: value,
  value: value,
}));

/** 豆瓣电影年份选项 */
export const DOUBAN_MOVIE_YEAR_OPTIONS = generateYearOptions(1900, new Date().getFullYear());

/** 豆瓣评分选项 */
export const DOUBAN_RATING_OPTIONS = Array.from({ length: 11 }, (_, i) => ({
  label: `${i}.0`,
  value: i,
}));

/** 豆瓣评论状态选项 */
export const DOUBAN_COMMENT_STATUS_OPTIONS = [
  { label: '待审核', value: CommentStatus.PENDING, color: 'warning' },
  { label: '已通过', value: CommentStatus.APPROVED, color: 'success' },
  { label: '已拒绝', value: CommentStatus.REJECTED, color: 'error' },
] as const;

/** 豆瓣用户状态选项 */
export const DOUBAN_USER_STATUS_OPTIONS = [
  { label: '正常', value: UserStatus.NORMAL, color: 'success' },
  { label: '禁用', value: UserStatus.DISABLED, color: 'error' },
] as const;

/** 豆瓣评论状态枚举 */
export enum DoubanCommentStatus {
  /** 待审核 */
  PENDING = 0,
  /** 已通过 */
  APPROVED = 1,
  /** 已拒绝 */
  REJECTED = 2,
}

/** 豆瓣用户状态枚举 */
export enum DoubanUserStatus {
  /** 正常 */
  NORMAL = 0,
  /** 禁用 */
  DISABLED = 1,
}