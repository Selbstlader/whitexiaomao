<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { CookingStepApi } from '#/api/cooking/step/index';

import { Page, useVbenModal } from '@vben/common-ui';

import { Image, message } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { 
  deleteStep, 
  getStepListByDishId,
} from '#/api/cooking/step/index';
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

/** 創建烹飪步驟 */
function handleCreate() {
  formModalApi.setData(null).open();
}

/** 批量創建烹飪步驟 */
function handleBatchCreate() {
  batchFormModalApi.setData(null).open();
}

/** 編輯烹飪步驟 */
function handleEdit(row: CookingStepApi.Step) {
  formModalApi.setData(row).open();
}

/** 刪除烹飪步驟 */
async function handleDelete(row: CookingStepApi.Step) {
  const hideLoading = message.loading({
    content: $t('ui.actionMessage.deleting', [`步驟${row.stepNumber}`]),
    key: 'action_key_msg',
  });
  try {
    await deleteStep(row.id as number);
    message.success({
      content: $t('ui.actionMessage.deleteSuccess', [`步驟${row.stepNumber}`]),
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
          
          const list = await getStepListByDishId(formValues.dishId);
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
  } as VxeTableGridOptions<CookingStepApi.Step>,
});
</script>

<template>
  <Page auto-content-height>
    <FormModal @success="onRefresh" />
    <BatchFormModal @success="onRefresh" />

    <Grid table-title="烹飪步驟列表">
      <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['烹飪步驟']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['cooking:step:create'],
              onClick: handleCreate,
            },
            {
              label: '批量添加步驟',
              type: 'default',
              icon: ACTION_ICON.UPLOAD,
              auth: ['cooking:step:create'],
              onClick: handleBatchCreate,
            },
          ]"
        />
      </template>
      <template #imageUrl="{ row }">
        <Image
          v-if="row.imageUrl"
          :src="row.imageUrl"
          :width="80"
          :preview="true"
        />
        <span v-else>無圖片</span>
      </template>
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.edit'),
              type: 'link',
              icon: ACTION_ICON.EDIT,
              auth: ['cooking:step:update'],
              onClick: handleEdit.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['cooking:step:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [`步驟${row.stepNumber}`]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        />
      </template>
    </Grid>
  </Page>
</template> 