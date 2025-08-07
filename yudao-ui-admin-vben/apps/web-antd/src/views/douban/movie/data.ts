import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DoubanMovieApi } from '#/api/douban/movie';

import { z } from '#/adapter/form';
import {
  DOUBAN_MOVIE_STATUS_OPTIONS,
  DOUBAN_MOVIE_TYPE_OPTIONS,
  DOUBAN_MOVIE_YEAR_OPTIONS,
  DOUBAN_RATING_OPTIONS,
  DoubanMovieStatus,
} from '#/types/douban';
import { getRangePickerDefaultProps } from '#/utils';

/** 新增/修改电影的表单 */
export function useFormSchema(): VbenFormSchema[] {
  return [
    {
      component: 'Input',
      fieldName: 'id',
      dependencies: {
        triggerFields: [''],
        show: () => false,
      },
    },
    {
      fieldName: 'movieTitle',
      label: '电影标题',
      component: 'Input',
      componentProps: {
        placeholder: '请输入电影标题',
        maxlength: 100,
        showCount: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'directedBy',
      label: '导演',
      component: 'Input',
      componentProps: {
        placeholder: '请输入导演姓名',
        maxlength: 50,
      },
      rules: 'required',
    },
    {
      fieldName: 'starring',
      label: '主演',
      component: 'Input',
      componentProps: {
        placeholder: '请输入主演，多个演员用逗号分隔',
        maxlength: 200,
      },
    },
    {
      fieldName: 'releaseDate',
      label: '上映日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择上映日期',
      },
      rules: 'required',
    },
    {
      fieldName: 'genre',
      label: '电影类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择电影类型',
        options: DOUBAN_MOVIE_TYPE_OPTIONS,
        mode: 'multiple',
        maxTagCount: 3,
      },
    },
    {
      fieldName: 'country',
      label: '国家',
      component: 'Input',
      componentProps: {
        placeholder: '请输入国家',
        maxlength: 50,
      },
    },
    {
      fieldName: 'language',
      label: '语言',
      component: 'Input',
      componentProps: {
        placeholder: '请输入语言',
        maxlength: 50,
      },
    },
    {
      fieldName: 'ratingNum',
      label: '豆瓣评分',
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入评分',
        min: 0,
        max: 10,
        step: 0.1,
      },
    },
    {
      fieldName: 'intro',
      label: '剧情简介',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入剧情简介',
        rows: 4,
        maxlength: 2000,
        showCount: true,
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'keyword',
      label: '关键字搜索',
      component: 'Input',
      componentProps: {
        placeholder: '请输入电影标题、导演或主演进行搜索',
        allowClear: true,
      },
    },
    {
      fieldName: 'movieTitle',
      label: '电影标题',
      component: 'Input',
      componentProps: {
        placeholder: '请输入电影标题',
        allowClear: true,
      },
    },
    {
      fieldName: 'directedBy',
      label: '导演',
      component: 'Input',
      componentProps: {
        placeholder: '请输入导演姓名',
        allowClear: true,
      },
    },
    {
      fieldName: 'releaseDate',
      label: '上映日期',
      component: 'DatePicker',
      componentProps: {
        placeholder: '请选择上映日期',
        allowClear: true,
      },
    },
    {
      fieldName: 'genre',
      label: '电影类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择电影类型',
        options: DOUBAN_MOVIE_TYPE_OPTIONS,
        allowClear: true,
      },
    },
    {
      fieldName: 'country',
      label: '国家',
      component: 'Input',
      componentProps: {
        placeholder: '请输入国家',
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns(): VxeTableGridOptions['columns'] {
  return [
    {
      field: 'id',
      title: '编号',
      width: 80,
    },
    {
      field: 'movieTitle',
      title: '电影标题',
      showOverflow: 'tooltip',
    },
    {
      field: 'directedBy',
      title: '导演',
      showOverflow: 'tooltip',
    },
    {
      field: 'starring',
      title: '主演',
      showOverflow: 'tooltip',
    },
    {
      field: 'releaseDate',
      title: '上映日期',
      width: 120,
      align: 'center',
      formatter: 'formatDate',
    },
    {
      field: 'genre',
      title: '类型',
      width: 120,
      showOverflow: 'tooltip',
      cellRender: {
        name: 'CellTag',
        props: {
          color: 'blue',
        },
      },
    },
    {
      field: 'ratingNum',
      title: '评分',
      width: 100,
      align: 'center',
      cellRender: {
        name: 'CellRate',
        props: {
          count: 10,
          allowHalf: true,
          disabled: true,
        },
      },
    },
    {
      field: 'country',
      title: '国家',
      width: 100,
      align: 'center',
    },
    {
      field: 'language',
      title: '语言',
      width: 100,
      align: 'center',
    }
  ];
}