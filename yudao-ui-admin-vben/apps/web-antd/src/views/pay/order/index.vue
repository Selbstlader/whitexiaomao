<script lang="ts" setup>
import type { VxeTableGridOptions } from '#/adapter/vxe-table';
import type { PayOrderApi } from '#/api/pay/order';

import { DocAlert, Page, useVbenModal } from '@vben/common-ui';

import { Tag } from 'ant-design-vue';

import { ACTION_ICON, TableAction, useVbenVxeGrid } from '#/adapter/vxe-table';
import { getOrderPage } from '#/api/pay/order';

import { useGridColumns, useGridFormSchema } from './data';
import Detail from './modules/detail.vue';

const [DetailModal, detailModalApi] = useVbenModal({
  connectedComponent: Detail,
  destroyOnClose: true,
});

/** 刷新表格 */
function onRefresh() {
  gridApi.query();
}

/** 查看详情 */
function handleDetail(row: PayOrderApi.Order) {
  detailModalApi.setData(row).open();
}

const [Grid, gridApi] = useVbenVxeGrid({
  formOptions: {
    schema: useGridFormSchema(),
    collapsed: false,
  },
  gridOptions: {
    cellConfig: {
      height: 80,
    },
    columns: useGridColumns(),
    height: 'auto',
    keepSource: true,
    proxyConfig: {
      ajax: {
        query: async ({ page }, formValues) => {
          return await getOrderPage({
            pageNo: page.currentPage,
            pageSize: page.pageSize,
            ...formValues,
          });
        },
      },
    },
    rowConfig: {
      keyField: 'id',
      isCurrent: true,
      isHover: true,
      resizable: true,
    },
    toolbarConfig: {
      refresh: { code: 'query' },
      search: true,
    },
  } as VxeTableGridOptions<PayOrderApi.Order>,
});
</script>

<template>
  <Page auto-content-height>
    <template #doc>
      <DocAlert
        title="支付宝支付接入"
        url="https://doc.iocoder.cn/pay/alipay-pay-demo/"
      />
      <DocAlert
        title="微信公众号支付接入"
        url="https://doc.iocoder.cn/pay/wx-pub-pay-demo/"
      />
      <DocAlert
        title="微信小程序支付接入"
        url="https://doc.iocoder.cn/pay/wx-lite-pay-demo/"
      />
    </template>
    <DetailModal @success="onRefresh" />
    <Grid table-title="支付订单列表">
      <template #actions="{ row }">
        <TableAction
          :actions="[
            {
              label: $t('common.detail'),
              type: 'link',
              icon: ACTION_ICON.VIEW,
              auth: ['pay:order:query'],
              onClick: handleDetail.bind(null, row),
            },
          ]"
        />
      </template>
      <template #no="{ row }">
        <div class="flex flex-col gap-1 text-left">
          <p class="text-sm">
            <Tag size="small" color="blue"> 商户</Tag> {{ row.merchantOrderId }}
          </p>
          <p class="text-sm" v-if="row.no">
            <Tag size="small" color="orange">支付</Tag> {{ row.no }}
          </p>
          <p class="text-sm" v-if="row.channelOrderNo">
            <Tag size="small" color="green">渠道</Tag>
            {{ row.channelOrderNo }}
          </p>
        </div>
      </template>
    </Grid>
  </Page>
</template>
