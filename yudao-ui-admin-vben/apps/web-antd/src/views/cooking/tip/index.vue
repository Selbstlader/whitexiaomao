<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CookingTipApi } from '#/api/cooking/tip/index';

import { Page, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { 
  deleteTip, 
  getTipListByDishId,
} from '#/api/cooking/tip/index';
import { $t } from '#/locales';

import { useGridColumns, useGridFormSchema } from './data';
import BatchForm from './modules/batch-form.vue';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

const [BatchFormModal, batchFormModalApi] = useVbenModal({
  connectedComponent: BatchForm,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 創建烹飪小貼士 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 批量創建烹飪小貼士 */
function handleBatchCreate() {
  batchFormModalApi.setData(null).open();
}

/** 編輯烹飪小貼士 */
function handleEdit(row: CookingTipApi.Tip) {
  formModalApi.setData(row).open();
}

/** 刪除烹飪小貼士 */
async function handleDelete(row: CookingTipApi.Tip) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', ['小貼士']),
    key: 'action_key_msg',
  });
  try {
    await deleteTip(row.id as number);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', ['小貼士']),
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
          if (!formValues.dishId) {
            return { list: [], total: 0 };
          }
          
          const list = await getTipListByDishId(formValues.dishId);
          return { list, total: list.length };
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
  } as VxeTableGridOptions<CookingTipApi.Tip>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <BatchFormModal @success="onRefresh" />

    <Grid table-title="烹飪小貼士列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['小貼士']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['cooking:tip:create'],
              onClick: handleCreate,
            },
            {
              label: '批量添加小貼士',
              type: 'default',
              icon: ACTION_ICON.UPLOAD,
              auth: ['cooking:tip:create'],
              onClick: handleBatchCreate,
            },
          ]"
        />
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['cooking:tip:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['cooking:tip:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', ['小貼士']),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template> 