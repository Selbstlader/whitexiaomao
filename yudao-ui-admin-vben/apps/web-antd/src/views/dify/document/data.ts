import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { $t } from '#/locales';

export function useGridColumns(): VxeGridPropTypes.Columns {
  return [
    {
      title: '知识库名称',
      field: 'name',
      width: 200,
      showOverflow: 'tooltip',
    },
    {
      title: '描述',
      field: 'description',
      width: 250,
      showOverflow: 'tooltip',
    },
    {
      title: '权限类型',
      field: 'permission',
      width: 120,
      formatter: ({ cellValue }) => {
        const permissionMap: Record<string, string> = {
          only_me: '仅自己',
          all_team_members: '团队成员',
          partial_members: '部分成员',
        };
        return permissionMap[cellValue] || cellValue;
      },
    },
    {
      title: '数据源类型',
      field: 'dataSourceType',
      width: 120,
      formatter: ({ cellValue }) => cellValue || '未知',
    },
    {
      title: '索引技术',
      field: 'indexingTechnique',
      width: 120,
      formatter: ({ cellValue }) => cellValue || '未知',
    },
    {
      title: '应用数量',
      field: 'appCount',
      width: 100,
      align: 'center',
      formatter: ({ cellValue }) => cellValue || 0,
    },
    {
      title: '文档数量',
      field: 'documentCount',
      width: 100,
      align: 'center',
      formatter: ({ cellValue }) => cellValue || 0,
    },
    {
      title: '字数统计',
      field: 'wordCount',
      width: 100,
      align: 'center',
      formatter: ({ cellValue }) => cellValue || 0,
    },
    {
      title: '创建者',
      field: 'createdBy',
      width: 120,
      formatter: ({ cellValue }) => cellValue || '未知',
    },
    {
      title: '创建时间',
      field: 'createdAt',
      width: 180,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '-';
        try {
          return new Date(cellValue).toLocaleString('zh-CN');
        } catch {
          return cellValue;
        }
      },
    },
    {
      title: $t('page.action.action'),
      field: 'action',
      width: 200,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export function useGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'name',
      label: '知识库名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入知识库名称',
        allowClear: true,
      },
    },
    {
      fieldName: 'permission',
      label: '权限类型',
      component: 'Select',
      componentProps: {
        placeholder: '请选择权限类型',
        allowClear: true,
        options: [
          { label: '仅自己', value: 'only_me' },
          { label: '团队成员', value: 'all_team_members' },
          { label: '部分成员', value: 'partial_members' },
        ],
      },
    },
    {
      fieldName: 'dataSourceType',
      label: '数据源类型',
      component: 'Input',
      componentProps: {
        placeholder: '请输入数据源类型',
        allowClear: true,
      },
    },
  ];
}
