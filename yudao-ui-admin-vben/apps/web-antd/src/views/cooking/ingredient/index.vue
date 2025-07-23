<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CookingIngredientApi } from '#/api/cooking/ingredient/index';

import { Page, useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { 
  deleteIngredient, 
  getIngredientListByDishId,
} from '#/api/cooking/ingredient/index';
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

/** 創建配料 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 批量創建配料 */
function handleBatchCreate() {
  batchFormModalApi.setData(null).open();
}

/** 編輯配料 */
function handleEdit(row: CookingIngredientApi.Ingredient) {
  formModalApi.setData(row).open();
}

/** 刪除配料 */
async function handleDelete(row: CookingIngredientApi.Ingredient) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [row.name]),
    key: 'action_key_msg',
  });
  try {
    await deleteIngredient(row.id as number);
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
          if (!formValues.dishId) {
            return { list: [], total: 0 };
          }
          
          const list = await getIngredientListByDishId(formValues.dishId);
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
  } as VxeTableGridOptions<CookingIngredientApi.Ingredient>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <BatchFormModal @success="onRefresh" />

    <Grid table-title="配料列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['配料']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['cooking:ingredient:create'],
              onClick: handleCreate,
            },
            {
              label: '批量添加配料',
              type: 'default',
              icon: ACTION_ICON.UPLOAD,
              auth: ['cooking:ingredient:create'],
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
              auth: ['cooking:ingredient:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['cooking:ingredient:delete'],
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