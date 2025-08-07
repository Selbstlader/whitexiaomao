import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DoubanCommentApi } from '#/api/douban/comment';

import { z } from '#/adapter/form';
import {
  DOUBAN_COMMENT_STATUS_OPTIONS,
  DoubanCommentStatus,
} from '#/types/douban';
import { getRangePickerDefaultProps } from '#/utils';

/** 新增/修改评论的表单 */
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
      fieldName: 'movieId',
      label: '电影ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入电影ID',
      },
      rules: 'required',
    },
    {
      fieldName: 'people',
      label: '评论用户',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名',
      },
      rules: 'required',
    },
    {
      fieldName: 'content',
      label: '评论内容',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入评论内容',
        rows: 4,
        maxlength: 1000,
        showCount: true,
      },
      rules: 'required',
    },
    {
      fieldName: 'star',
      label: '评分',
      component: 'Rate',
      componentProps: {
        count: 5,
        allowHalf: false,
      },
      rules: 'required',
    },
  ];
}

/** 审核评论的表单 */
export function useAuditFormSchema(): VbenFormSchema[] {
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
      fieldName: 'status',
      label: '审核状态',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '通过', value: DoubanCommentStatus.APPROVED },
          { label: '拒绝', value: DoubanCommentStatus.REJECTED },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'auditRemark',
      label: '审核备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入审核备注（可选）',
        rows: 3,
        maxlength: 200,
        showCount: true,
      },
    },
  ];
}

/** 批量审核的表单 */
export function useBatchAuditFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'status',
      label: '审核状态',
      component: 'RadioGroup',
      componentProps: {
        options: [
          { label: '批量通过', value: DoubanCommentStatus.APPROVED },
          { label: '批量拒绝', value: DoubanCommentStatus.REJECTED },
        ],
      },
      rules: 'required',
    },
    {
      fieldName: 'auditRemark',
      label: '审核备注',
      component: 'Textarea',
      componentProps: {
        placeholder: '请输入审核备注（可选）',
        rows: 3,
        maxlength: 200,
        showCount: true,
      },
    },
  ];
}

/** 列表的搜索表单 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'movieId',
      label: '电影ID',
      component: 'Input',
      componentProps: {
        placeholder: '请输入电影ID',
        allowClear: true,
      },
    },
    {
      fieldName: 'people',
      label: '评论用户',
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名',
        allowClear: true,
      },
    },
    {
      fieldName: 'content',
      label: '评论内容',
      component: 'Input',
      componentProps: {
        placeholder: '请输入评论内容关键词',
        allowClear: true,
      },
    },
    {
      fieldName: 'star',
      label: '评分',
      component: 'Select',
      componentProps: {
        placeholder: '请选择评分',
        options: [
          { label: '1星', value: 1 },
          { label: '2星', value: 2 },
          { label: '3星', value: 3 },
          { label: '4星', value: 4 },
          { label: '5星', value: 5 },
        ],
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '创建时间',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
        allowClear: true,
      },
    },
  ];
}

/** 列表的字段 */
export function useGridColumns<T = DoubanCommentApi.Comment>(): VxeTableGridOptions['columns'] {
  return [
    {
      type: 'checkbox',
      width: 50,
      fixed: 'left',
    },
    {
      field: 'id',
      title: '评论编号',
      width: 100,
      align: 'center',
    },
    {
      field: 'movieId',
      title: '电影ID',
      width: 120,
      showOverflow: 'tooltip',
    },
    {
      field: 'movieTitle',
      title: '电影标题',
      // width: 180,
      showOverflow: 'tooltip',
    },
    {
      field: 'people',
      title: '评论用户',
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      field: 'content',
      title: '评论内容',
      // width: 250,
      showOverflow: 'tooltip',
    },
    {
      field: 'star',
      title: '评分',
      width: 120,
      align: 'center',
      cellRender: {
        name: 'CellRate',
        props: ({ row }: { row: T }) => ({
          modelValue: (row as any).star || 0,
          count: 5,
          allowHalf: false,
          disabled: true,
        }),
      },
    },
    // {
    //   field: 'createTime',
    //   title: '创建时间',
    //   width: 180,
    //   formatter: ({ cellValue }: { cellValue: number }) => {
    //     if (!cellValue) return '-';
    //     return new Date(cellValue).toLocaleString('zh-CN', {
    //       year: 'numeric',
    //       month: '2-digit',
    //       day: '2-digit',
    //       hour: '2-digit',
    //       minute: '2-digit',
    //       second: '2-digit',
    //     });
    //   },
    // },
    // {
    //   title: '操作',
    //   width: 160,
    //   fixed: 'right',
    //   slots: { default: 'actions' },
    // },
  ];
}