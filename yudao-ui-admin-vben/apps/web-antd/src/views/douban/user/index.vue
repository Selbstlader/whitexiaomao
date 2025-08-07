<script lang="ts" setup>
import type { VxeGridInstance } from '#/adapter/vxe-table';
import type { DoubanUserApi } from '#/api/douban/user';

import { ref } from 'vue';

import { Page, useVbenModal } from '@vben/common-ui';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import {
  createUser,
  deleteUser,
  exportUser,
  getUserPage,
  resetUserPassword,
  updateUser,
  updateUserStatus,
} from '#/api/douban/user';
import {
  useFormSchema,
  useGridColumns,
  useGridFormSchema,
  useResetPasswordFormSchema,
} from './data';

defineOptions({
  name: 'DoubanUserManagement',
});

// 表格实例
const gridRef = ref<VxeGridInstance>();

// 弹窗配置
const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: () => import('./modules/form.vue'),
  destroyOnClose: true,
});

const [ResetPasswordModal, resetPasswordModalApi] = useVbenModal({
  connectedComponent: () => import('./modules/reset-password.vue'),
  destroyOnClose: true,
});

// 表单配置
const formSchema = useFormSchema();
const gridColumns = useGridColumns();
const gridFormSchema = useGridFormSchema();

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: gridFormSchema,
  },
  gridOptions: {
    adaptiveConfig: {
      offsetBottom: 32,
    },
    columns: gridColumns,
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
          return getUserPage(query);
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

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 创建用户 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 编辑用户 */
function handleEdit(row: DoubanUserApi.User) {
  formModalApi.setData(row).open();
}

/** 重置密码 */
function handleResetPassword(row: DoubanUserApi.User) {
  resetPasswordModalApi.setData(row).open();
}

/** 删除用户 */
function handleDelete(row: DoubanUserApi.User) {
  if (row.id) {
    deleteUser(row.id).then(() => {
      onRefresh();
    });
  }
}

/** 更新用户状态 */
function handleStatusChange(row: DoubanUserApi.User, status: number) {
  if (row.id) {
    updateUserStatus({
      id: row.id,
      status,
    }).then(() => {
      onRefresh();
    });
  }
}

/** 导出用户 */
function handleExport() {
  const formData = gridApi.getFormData();
  exportUser({
    pageNo: 1,
    pageSize: 10000,
    ...formData,
  }).then(() => {
    // 导出成功处理
  });
}
</script>

<template>
  <Page auto-content-height>
    <Grid>
      <!-- <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              icon: ACTION_ICON.ADD,
              label: '新增用户',
              onClick: handleCreate,
            },
            {
              icon: 'mdi:microsoft-excel',
              label: '导出Excel',
              onClick: handleExport,
            },
          ]"
        />
      </template> -->

      <!-- <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              icon: ACTION_ICON.EDIT,
              label: '编辑',
              onClick: () => handleEdit(row),
            },
            {
              icon: 'mdi:lock-reset',
              label: '重置密码',
              onClick: () => handleResetPassword(row),
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

    <!-- 重置密码弹窗 -->
    <!-- <ResetPasswordModal @success="onRefresh" /> -->
  </Page>
</template>

<style scoped>
/* 自定义样式 */
</style>