import type { VbenFormSchema } from '#/adapter/form';
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CookingDishApi } from '#/api/cooking/dish/index';

import { z } from '#/adapter/form';
import { getSimpleCategoryList } from '#/api/cooking/category/index';
import { getRangePickerDefaultProps } from '#/utils';

// 難度級別選項
const DIFFICULTY_OPTIONS = [
  { label: '簡單', value: 1 },
  { label: '普通', value: 2 },
  { label: '中等', value: 3 },
  { label: '較難', value: 4 },
  { label: '困難', value: 5 },
];

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
      fieldName: 'categoryId',
      label: '分類',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleCategoryList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '請選擇分類',
      },
      rules: 'required',
    },
    {
      fieldName: 'name',
      label: '菜品名稱',
      component: 'Input',
      rules: 'required',
      componentProps: {
        placeholder: '請輸入菜品名稱',
      },
    },
    {
      fieldName: 'description',
      label: '菜品描述',
      component: 'Textarea',
      componentProps: {
        placeholder: '請輸入菜品描述',
        rows: 3,
      },
    },
    {
      fieldName: 'difficulty',
      label: '難度等級',
      component: 'Select',
      componentProps: {
        options: DIFFICULTY_OPTIONS,
        placeholder: '請選擇難度等級',
      },
      rules: 'required',
    },
    {
      fieldName: 'cookingTime',
      label: '烹飪時間',
      component: 'InputNumber',
      componentProps: {
        placeholder: '請輸入烹飪時間(分鐘)',
        min: 1,
        style: {
          width: '100%',
        },
        addonAfter: '分鐘',
      },
      rules: 'required',
    },
    {
      fieldName: 'imageFile',
      label: '菜品圖片',
      component: 'Upload',
      componentProps: {
        listType: 'picture-card',
        maxCount: 1,
        accept: 'image/*',
      },
    },
  ];
}

/** 列表的搜索表單 */
export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '菜品名稱',
      component: 'Input',
      componentProps: {
        placeholder: '請輸入菜品名稱',
        allowClear: true,
      },
    },
    {
      fieldName: 'categoryId',
      label: '分類',
      component: 'ApiSelect',
      componentProps: {
        api: getSimpleCategoryList,
        labelField: 'name',
        valueField: 'id',
        placeholder: '請選擇分類',
        allowClear: true,
      },
    },
    {
      fieldName: 'difficulty',
      label: '難度等級',
      component: 'Select',
      componentProps: {
        options: DIFFICULTY_OPTIONS,
        placeholder: '請選擇難度等級',
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
      title: '菜品編號',
    },
    {
      field: 'name',
      title: '菜品名稱',
    },
    {
      field: 'categoryName',
      title: '所屬分類',
    },
    {
      field: 'difficulty',
      title: '難度等級',
      formatter: ({ cellValue }) => {
        const option = DIFFICULTY_OPTIONS.find(item => item.value === cellValue);
        return option ? option.label : cellValue;
      },
    },
    {
      field: 'cookingTime',
      title: '烹飪時間(分鐘)',
    },
    {
      field: 'createTime',
      title: '創建時間',
      formatter: 'formatDateTime',
    },
    {
      title: '操作',
      width: 220,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
} 