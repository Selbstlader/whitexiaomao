import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CookingCategoryApi } from '#/api/cooking/category/index';

import { getRangePickerDefaultProps } from '#/utils';

/** 新增/修改的表單 */
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
      fieldName: 'name',
      label: '分類名稱',
      component: 'Input',
      rules: 'required',
      componentProps: {
        placeholder: '請輸入分類名稱',
      },
    },
  ];
}

/** 列表的搜索表單 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '分類名稱',
      component: 'Input',
      componentProps: {
        placeholder: '請輸入分類名稱',
        allowClear: true,
      },
    },
    {
      fieldName: 'createTime',
      label: '創建時間',
      component: 'RangePicker',
      componentProps: {
        ...getRangePickerDefaultProps(),
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
      title: '分類編號',
    },
    {
      field: 'name',
      title: '分類名稱',
    },
    {
      field: 'createTime',
      title: '創建時間',
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 180,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
} 