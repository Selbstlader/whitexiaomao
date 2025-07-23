import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CookingTipApi } from '#/api/cooking/tip/index';

import { getSimpleDishList } from '#/api/cooking/dish/index';
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
      fieldName: 'dishId',
      label: '所屬菜品',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleDishList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '請選擇菜品',
      },
      rules: 'required',
    },
    {
      fieldName: 'content',
      label: '小貼士內容',
      component: 'Textarea',
      rules: 'required',
      componentProps: {
        placeholder: '請輸入小貼士內容',
        rows: 3,
      },
    },
  ];
}

/** 批量添加小貼士的表單 */
export function useBatchFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'dishId',
      label: '所屬菜品',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleDishList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '請選擇菜品',
      },
      rules: 'required',
    },
    {
      fieldName: 'tips',
      label: '小貼士列表',
      component: 'Custom',
      rules: 'required',
    },
  ];
}

/** 列表的搜索表單 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'dishId',
      label: '所屬菜品',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleDishList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '請選擇菜品',
        allowClear: true,
      },
      rules: 'required',
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
      title: '小貼士編號',
    },
    {
      field: 'dishId',
      title: '所屬菜品',
    },
    {
      field: 'content',
      title: '小貼士內容',
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