<script lang="ts" setup>
import type { VxeGridInstance } from 'vxe-table';
import type { DoubanCommentApi } from '#/api/douban/comment';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { message } from 'ant-design-vue';

import {
  deleteComment,
  exportComment,
  getCommentPage,
  getCommentStats,
} from '#/api/douban/comment';
import {
  useGridColumns,
  useGridFormSchema,
} from './data';

defineOptions({
  name: 'DoubanCommentManagement',
});

const gridRef = ref<VxeGridInstance>();
// const statsRef = ref<DoubanCommentApi.CommentStats>();

// 弹窗配置
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: () => import('./modules/form.vue'),
  destroyOnClose: true,
});

const [AuditModal, auditModalApi] = useVbenModal({
  connectedComponent: () => import('./modules/audit.vue'),
  destroyOnClose: true,
});

const [BatchAuditModal, batchAuditModalApi] = useVbenModal({
  connectedComponent: () => import('./modules/batch-audit.vue'),
  destroyOnClose: true,
});

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
  },
  gridOptions: {
    adaptiveConfig: {
      offsetBottom: 32,
    },
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: true,
    },
    printConfig: {
      enabled: true,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          const query = {
            ...formValues,
            pageNo: page.currentPage,
            pageSize: page.pageSize,
          };
          const result = await getCommentPage(query);
          // 同时获取统计信息
          loadStats();
          return result;
        },
      },
    },
    toolbarConfig: {
      enabled: true,
      export: true,
      print: true,
      refresh: true,
      zoom: true,
      custom: true,
      search: true,
    },
  },
  gridEvents: {
    toolbarToolClick({ code }) {
      const $grid = gridRef.value;
      switch (code) {
        case 'ModalAdd': {
          handleCreate();
          break;
        }
        case 'ExportExcel': {
          handleExport();
          break;
        }
        default: {
          $grid?.commitProxy(code);
        }
      }
    },
  },
  gridRef,
});

/** 加载统计信息 */
async function loadStats() {
  try {
    // statsRef.value = await getCommentStats();
  } catch (error) {
    console.error('获取统计信息失败:', error);
  }
}

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
  // loadStats();
}

// /** 创建评论 */
// function handleCreate() {
//   formModalApi.setData(null).open();
// }

// /** 编辑评论 */
// function handleEdit(row: DoubanCommentApi.Comment) {
//   formModalApi.setData(row).open();
// }

// /** 审核评论 */
// function handleAudit(row: DoubanCommentApi.Comment) {
//   auditModalApi.setData(row).open();
// }

// /** 批量审核 */
// function handleBatchAudit() {
//   const $grid = gridRef.value;
//   const selectedRows = $grid?.getCheckboxRecords();
  
//   if (!selectedRows || selectedRows.length === 0) {
//     message.warning('请先选择要审核的评论');
//     return;
//   }
  
//   batchAuditModalApi.setData({
//     ids: selectedRows.map((row: any) => row.id),
//   }).open();
// }

/** 删除评论 */
// function handleDelete(row: DoubanCommentApi.Comment) {
//   if (row.id) {
//     deleteComment(row.id).then(() => {
//       onRefresh();
//     });
//   }
// }

// /** 导出评论 */
// function handleExport() {
//   const formData = gridApi.getFormData();
//   exportComment({
//     pageNo: 1,
//     pageSize: 10000,
//     ...formData,
//   }).then(() => {
//     // 导出成功处理
//   });
// }

// 初始化加载统计信息
loadStats();
</script>

<template>
  <Page auto-content-height>
    <!-- 统计卡片 -->
    <!-- <div v-if="statsRef" class="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div class="rounded-lg bg-white p-4 shadow">
        <div class="text-sm text-gray-500">总评论数</div>
        <div class="text-2xl font-bold text-blue-600">{{ statsRef.totalCount }}</div>
      </div>
      <div class="rounded-lg bg-white p-4 shadow">
        <div class="text-sm text-gray-500">待审核</div>
        <div class="text-2xl font-bold text-orange-600">{{ statsRef.pendingCount }}</div>
      </div>
      <div class="rounded-lg bg-white p-4 shadow">
        <div class="text-sm text-gray-500">已通过</div>
        <div class="text-2xl font-bold text-green-600">{{ statsRef.approvedCount }}</div>
      </div>
      <div class="rounded-lg bg-white p-4 shadow">
        <div class="text-sm text-gray-500">已拒绝</div>
        <div class="text-2xl font-bold text-red-600">{{ statsRef.rejectedCount }}</div>
      </div>
    </div> -->

    <Grid>
      <template #toolbar-tools>
        <!-- <TableAction
          :actions="[
            {
              icon: ACTION_ICON.ADD,
              label: '新增评论',
              onClick: handleCreate,
            },
            {
              icon: 'mdi:check-all',
              label: '批量审核',
              onClick: handleBatchAudit,
            },
            {
              icon: 'mdi:microsoft-excel',
              label: '导出Excel',
              onClick: handleExport,
            },
          ]"
        /> -->
      </template>

      <!-- <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              icon: ACTION_ICON.EDIT,
              label: '编辑',
              onClick: () => handleEdit(row),
            },
            {
              icon: 'mdi:gavel',
              label: '审核',
              onClick: () => handleAudit(row),
              show: row.status === 0,
            },
            {
              icon: ACTION_ICON.DELETE,
              label: '删除',
              onClick: () => handleDelete(row),
            },
          ]"
        />
      </template> -->
    </Grid>

    <!-- 新增/编辑弹窗 -->
    <!-- <FormModal @success="onRefresh" /> -->

    <!-- 审核弹窗 -->
    <!-- <AuditModal @success="onRefresh" /> -->

    <!-- 批量审核弹窗 -->
    <!-- <BatchAuditModal @success="onRefresh" /> -->
  </Page>
</template>

<style scoped>
/* 自定义样式 */
</style>