import type { VbenFormSchema } from '#/adapter/form';
import type { VxeGridPropTypes } from '#/adapter/vxe-table';

import { $t } from '#/locales';

export function useDocumentGridColumns(): VxeGridPropTypes.Columns {
  return [
    {
      title: '文档名称',
      field: 'name',
      // width: 250,
      showOverflow: 'tooltip',
    },
    {
      title: '数据源类型',
      field: 'data_source_type',
      width: 120,
      formatter: ({ cellValue }) => {
        const typeMap: Record<string, string> = {
          upload_file: '上传文件',
          notion_import: 'Notion导入',
          website_crawl: '网站爬取',
          text_input: '文本输入',
        };
        return typeMap[cellValue] || cellValue || '未知';
      },
    },
    {
      title: '状态',
      field: 'enabled',
      width: 80,
      align: 'center',
      formatter: ({ cellValue }) => cellValue ? '启用' : '禁用',
    },
    {
      title: '处理状态',
      field: 'display_status',
      width: 120,
      align: 'center',
      formatter: ({ cellValue, row }) => {
        if (cellValue) {
          const statusMap: Record<string, string> = {
            available: '可用',
            processing: '处理中',
            error: '处理失败',
            paused: '已暂停',
            waiting: '等待中',
          };
          return statusMap[cellValue] || cellValue;
        }

        const indexingStatusMap: Record<string, string> = {
          completed: '已完成',
          processing: '处理中',
          error: '处理失败',
          paused: '已暂停',
          waiting: '等待中',
        };
        return indexingStatusMap[row.indexing_status] || row.indexing_status || '未知';
      },
    },
    {
      title: '字数统计',
      field: 'word_count',
      width: 100,
      align: 'center',
      formatter: ({ cellValue }) => cellValue || 0,
    },
    {
      title: '命中次数',
      field: 'hit_count',
      width: 100,
      align: 'center',
      formatter: ({ cellValue }) => cellValue || 0,
    },
    {
      title: 'Token数量',
      field: 'tokens',
      width: 100,
      align: 'center',
      formatter: ({ cellValue }) => cellValue || 0,
    },
    {
      title: '创建者',
      field: 'created_by',
      width: 120,
      formatter: ({ cellValue }) => cellValue || '未知',
    },
    {
      title: '创建时间',
      field: 'created_at',
      width: 180,
      formatter: ({ cellValue }) => {
        if (!cellValue) return '-';
        try {
          // 后端返回的是时间戳（秒）
          return new Date(cellValue * 1000).toLocaleString('zh-CN');
        } catch {
          return cellValue;
        }
      },
    },
    {
      title: $t('page.action.action'),
      field: 'action',
      width: 80,
      fixed: 'right',
      slots: { default: 'actions' },
    },
  ];
}

export function useDocumentGridFormSchema(): VbenFormSchema[] {
  return [
    {
      fieldName: 'keyword',
      label: '文档名称',
      component: 'Input',
      componentProps: {
        placeholder: '请输入文档名称',
        allowClear: true,
      },
    },
    {
      fieldName: 'enabled',
      label: '状态',
      component: 'Select',
      componentProps: {
        placeholder: '请选择状态',
        allowClear: true,
        options: [
          { label: '启用', value: true },
          { label: '禁用', value: false },
        ],
      },
    },
  ];
}
