<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DifyDatasetApi } from '#/api/dify/dataset';

import { useRouter } from 'vue-router';

import { DocAlert, Page, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { deleteDataset, exportDataset, getDatasetList } from '#/api/dify/dataset';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import DetailModal from './modules/detail.vue';

const router = useRouter();

const [DetailModalComponent, detailModalApi] = useVbenModal({
  connectedComponent: DetailModal,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  try {
    const formValues = await gridApi.formApi.getValues();
    console.log('导出参数:', formValues);
    const exportParams = {
      pageNo: 1,
      pageSize: 10000,
      ...formValues,
    };
    const data = await exportDataset(exportParams);
    downloadFileFromBlobPart({ fileName: 'Dify知识库.xls', source: data });
    message.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    message.error('导出失败');
  }
}

/** 查看文档管理 */
function handleView(row: DifyDatasetApi.Dataset) {
  router.push({
    path: `/dify/document/${row.id}/documents`,
    query: {
      datasetName: row.name,
    },
  });
}

/** 查看知识库详情 */
function handleViewDetail(row: DifyDatasetApi.Dataset) {
  detailModalApi.setData(row).open();
}

/** 编辑知识库 */
function handleEdit(row: DifyDatasetApi.Dataset) {
  message.info(`编辑功能待实现: ${row.name}`);
}

/** 删除知识库 */
async function handleDelete(row: DifyDatasetApi.Dataset) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    key: 'action_key_msg',
  });
  try {
    await deleteDataset(row.id as string);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [row.name]),
      key: 'action_key_msg',
    });
    onRefresh();
  } finally {
    hideLoading();
  }
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          try {
            console.log('查询参数:', { page, formValues });
            const result = await getDatasetList({
              pageNo: page.currentPage,
              pageSize: page.pageSize,
              ...formValues,
            });
            return result || [];
          } catch (error) {
            console.error('查询失败:', error);
            message.error('获取数据失败: ' + (error as Error).message);
            return { list: [], total: 0 };
          }
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      refresh: { code: 'query' },
      search: true,
    },
  } as VxeTableGridOptions<DifyDatasetApi.Dataset>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert title="Dify 知识库" url="https://doc.iocoder.cn/ai/knowledge/" />
    </template>

    <DetailModalComponent />

    <Grid table-title="Dify 知识库列表">
      <template #toolbar-tools>
        <TableAction :actions="[
          {
            label: $t('ui.actionTitle.export'),
            type: 'primary',
            icon: ACTION_ICON.DOWNLOAD,
            onClick: handleExport,
          },
        ]" />
      </template>
      <template #actions="{ row }">
        <TableAction :actions="[
          {
            label: '文档管理',
            type: 'link',
            icon: ACTION_ICON.VIEW,
            onClick: handleView.bind(null, row),
          },
          {
            label: $t('common.detail'),
            type: 'link',
            icon: ACTION_ICON.MORE,
            onClick: handleViewDetail.bind(null, row),
          },
          {
            label: $t('common.edit'),
            type: 'link',
            icon: ACTION_ICON.EDIT,
            onClick: handleEdit.bind(null, row),
          },
          {
            label: $t('common.delete'),
            type: 'link',
            danger: true,
            icon: ACTION_ICON.DELETE,
            popConfirm: {
              title: $t('ui.actionMessage.deleteConfirm', [row.name]),
              confirm: handleDelete.bind(null, row),
            },
          },
        ]" />
      </template>
    </Grid>
  </Page>
</template>