<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';

import { DocAlert, Page, useVbenModal } from '@vben/common-ui';
import { Search } from '@vben/icons';

import { Button } from 'ant-design-vue';

import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getAreaTree } from '#/api/system/area';

import { useGridColumns } from './data';
import Form from './modules/form.vue';

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: Form,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 查询 IP */
function handleQueryIp() {
  formModalApi.setData(null).open();
}

const [Grid, gridApi] = useVbenVxeGrid({
  gridOptions: {
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    pagerConfig: {
      enabled: false,
    },
    proxyConfig: {
      ajax: {
        query: async () => {
          return await getAreaTree();
        },
      },
    },
    rowConfig: {
      keyField: 'id',
    },
    toolbarConfig: {
      refresh: { code: 'query' },
    },
    treeConfig: {
      rowField: 'id',
      reserve: true,
    },
  } as VxeTableGridOptions,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert title="地区 & IP" url="https://doc.iocoder.cn/area-and-ip/" />
    </template>

    <FormModal @success="onRefresh" />
    <Grid table-title="地区列表">
      <template #toolbar-tools>
        <Button type="primary" @click="handleQueryIp">
          <Search class="size-5" />
          IP 查询
        </Button>
      </template>
    </Grid>
  </Page>
</template>
