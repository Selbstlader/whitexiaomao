<script lang="ts" setup>
import type { VxeGridInstance } from 'vxe-table';
import type { DoubanMovieApi } from '#/api/douban/movie';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';
import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { $t } from '#/locales';

import {
  deleteMovie,
  exportMovie,
  getMoviePage,
} from '#/api/douban/movie';
import { useGridColumns, useGridFormSchema } from './data';

defineOptions({
  name: 'DoubanMovieManagement',
});

// 表格实例
const gridRef = ref<VxeGridInstance>();



// 表单配置
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
          return getMoviePage(query);
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
  gridRef,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 查看电影详情 */
function handleView(row: DoubanMovieApi.Movie) {
  // 可以在这里添加查看详情的逻辑
  console.log('查看电影详情:', row);
}

/** 删除电影 */
function handleDelete(row: DoubanMovieApi.Movie) {
  // 使用确认对话框删除
  deleteMovie(row.id).then(() => {
    onRefresh();
  });
}

/** 导出电影 */
function handleExport() {
  const formData = gridApi.getFormData();
  exportMovie({
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
    <!-- <FormModal @success="onRefresh" /> -->
    
    <Grid table-title="电影列表">
      <!-- <template #toolbar-tools>
        <TableAction
          :actions="[
            {
              label: $t('ui.actionTitle.create', ['电影']),
              type: 'primary',
              icon: ACTION_ICON.ADD,
              auth: ['douban:movie:create'],
              onClick: handleCreate,
            },
            {
              label: $t('ui.actionTitle.export'),
              type: 'primary',
              icon: ACTION_ICON.DOWNLOAD,
              auth: ['douban:movie:export'],
              onClick: handleExport,
            },
          ]"
        />
      </template> -->
      
      <template #actions="{ row }">
        <!-- <TableAction
          :actions="[
            {
              label: $t('common.view'),
              type: 'link',
              icon: ACTION_ICON.VIEW,
              onClick: handleView.bind(null, row),
            },
            {
              label: $t('common.delete'),
              type: 'link',
              danger: true,
              icon: ACTION_ICON.DELETE,
              auth: ['douban:movie:delete'],
              popConfirm: {
                title: $t('ui.actionMessage.deleteConfirm', [row.title]),
                confirm: handleDelete.bind(null, row),
              },
            },
          ]"
        /> -->
      </template>
    </Grid>
  </Page>
</template>

<style scoped>
/* 自定义样式 */
</style>