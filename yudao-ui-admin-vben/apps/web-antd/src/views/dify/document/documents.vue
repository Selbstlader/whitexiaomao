<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { DifyDocumentApi } from '#/api/dify/document';

import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { DocAlert, Page, useVbenModal } from '@vben/common-ui';
import { downloadFileFromBlobPart } from '@vben/utils';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { 
  deleteDocument, 
  exportDocuments, 
  getDocumentList, 
  toggleDocumentStatus,
  reprocessDocument 
} from '#/api/dify/document';
import { $t } from '#/locales';

import { useDocumentGridColumns, useDocumentGridFormSchema } from './documents-data';
import DocumentDetailModal from './modules/document-detail.vue';
import DocumentCreateModal from './modules/document-create.vue';

const route = useRoute();
const router = useRouter();

// 获取知识库ID
const datasetId = computed(() => route.params.datasetId as string);
const datasetName = computed(() => route.query.datasetName as string || '知识库');

const [DocumentDetailModalComponent, documentDetailModalApi] = useVbenModal({
  connectedComponent: DocumentDetailModal,
  destroyOnClose: true,
});

const [DocumentCreateModalComponent, documentCreateModalApi] = useVbenModal({
  connectedComponent: DocumentCreateModal,
  destroyOnClose: true,
});

/** 返回知识库列表 */
function goBack() {
  router.push('/dify/document');
}

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 导出表格 */
async function handleExport() {
  try {
    const formValues = await gridApi.formApi.getValues();
    const exportParams = {
      datasetId: datasetId.value,
      pageNo: 1,
      pageSize: 10000,
      ...formValues,
    };
    const data = await exportDocuments(exportParams);
    downloadFileFromBlobPart({ fileName: `${datasetName.value}-文档列表.xls`, source: data });
    message.success('导出成功');
  } catch (error) {
    console.error('导出失败:', error);
    message.error('导出失败');
  }
}

/** 新增文档 */
function handleCreate() {
  documentCreateModalApi.setData({ datasetId: datasetId.value }).open();
}

/** 查看详情 */
function handleView(row: DifyDocumentApi.Document) {
  documentDetailModalApi.setData({ ...row, datasetId: datasetId.value }).open();
}



/** 启用/禁用文档 */
async function handleToggleStatus(row: DifyDocumentApi.Document) {
  const newStatus = !row.enabled;
  const hideLoading = message.loading({
    content: newStatus ? '正在启用文档...' : '正在禁用文档...',
    key: 'toggle_status_msg',
  });
  try {
    await toggleDocumentStatus(datasetId.value, row.id as string, newStatus);
    message.success({
      content: newStatus ? '文档启用成功' : '文档禁用成功',
      key: 'toggle_status_msg',
    });
    onRefresh();
  } catch (error) {
    console.error('状态切换失败:', error);
    message.error('操作失败');
  } finally {
    hideLoading();
  }
}

/** 重新处理文档 */
async function handleReprocess(row: DifyDocumentApi.Document) {
  const hideLoading = message.loading({
    content: '正在重新处理文档...',
    key: 'reprocess_msg',
  });
  try {
    await reprocessDocument(datasetId.value, row.id as string);
    message.success({
      content: '文档重新处理已开始',
      key: 'reprocess_msg',
    });
    onRefresh();
  } finally {
    hideLoading();
  }
}

/** 删除文档 */
async function handleDelete(row: DifyDocumentApi.Document) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    key: 'action_key_msg',
  });
  try {
    await deleteDocument(datasetId.value, row.id as string);
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
    schema: useDocumentGridFormSchema(),
  },
  gridOptions: {
    columns: useDocumentGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          try {
            console.log('查询参数:', { page, formValues, datasetId: datasetId.value });
            const result = await getDocumentList({
              datasetId: datasetId.value,
              pageNo: page.currentPage,
              pageSize: page.pageSize,
              ...formValues,
            });
            return result;
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
  } as VxeTableGridOptions<DifyDocumentApi.Document>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert 
        :title="`${datasetName} - 文档管理`" 
        url="https://doc.iocoder.cn/ai/knowledge/" 
      />
    </template>

    <DocumentDetailModalComponent />
    <DocumentCreateModalComponent @success="onRefresh" />

    <Grid :table-title="`${datasetName} - 文档列表`">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: '返回',
              type: 'default',
              icon: 'lucide:arrow-left',
              onClick: goBack,
            },
            {
              label: '新增文档',
              type: 'primary',
              icon: ACTION_ICON.ADD,
              onClick: handleCreate,
            },
            {
              label: $t('ui.actionTitle.export'),
              type: 'default',
              icon: ACTION_ICON.DOWNLOAD,
              onClick: handleExport,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            
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
          ]"
        />
      </template>
    </Grid>
  </Page>
</template>
