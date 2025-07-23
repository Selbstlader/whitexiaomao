import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CookingStepApi } from '#/api/cooking/step/index';

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
      fieldName: 'stepNumber',
      label: '步驟順序',
      component: 'InputNumber',
      rules: 'required',
      componentProps: {
        placeholder: '請輸入步驟順序',
        min: 1,
        style: {
          width: '100%',
        },
      },
    },
    {
      fieldName: 'description',
      label: '步驟描述',
      component: 'Textarea',
      rules: 'required',
      componentProps: {
        placeholder: '請輸入步驟描述',
        rows: 3,
      },
    },
    {
      fieldName: 'imageFile',
      label: '步驟圖片',
      component: 'Upload',
      componentProps: {
        listType: 'picture-card',
        maxCount: 1,
        accept: 'image/*',
      },
    },
  ];
}

/** 批量添加步驟的表單 */
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
      fieldName: 'steps',
      label: '步驟列表',
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
      title: '步驟編號',
    },
    {
      field: 'dishId',
      title: '所屬菜品',
    },
    {
      field: 'stepNumber',
      title: '步驟順序',
    },
    {
      field: 'description',
      title: '步驟描述',
    },
    {
      field: 'imageUrl',
      title: '步驟圖片',
      slots: { default: 'imageUrl' },
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