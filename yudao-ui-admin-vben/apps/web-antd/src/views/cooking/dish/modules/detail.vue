<script lang="ts" setup>
import type { CookingDishApi } from '#/api/cooking/dish/index';

import { onMounted, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Descriptions, Divider, Image, Tag } from 'ant-design-vue';

import { getDishDetail, getDish } from '#/api/cooking/dish/index';

// 難度等級映射
const difficultyMap: Record<number, { label: string; color: string }> = {
  1: { label: '簡單', color: 'green' },
  2: { label: '普通', color: 'cyan' },
  3: { label: '中等', color: 'blue' },
  4: { label: '較難', color: 'orange' },
  5: { label: '困難', color: 'red' },
};

const dishDetail = ref<CookingDishApi.DishDetail>();
const loading = ref(true);

// 獲取難度標籤
function getDifficultyTag(difficulty: number) {
  const config = difficultyMap[difficulty as keyof typeof difficultyMap] || { label: difficulty.toString(), color: 'default' };
  return { tag: true, color: config.color, label: config.label };
}

const [Modal, modalApi] = useVbenModal({
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      dishDetail.value = undefined;
      return;
    }

    // 加載數據
    const data = modalApi.getData<CookingDishApi.Dish>();
    if (!data || !data.id) {
      return;
    }

    modalApi.lock();
    loading.value = true;

    try {
      dishDetail.value = await getDishDetail(data.id as number);
    } finally {
      loading.value = false;
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal title="菜品詳情" width="800px">
    <a-spin :spinning="loading">
      <div v-if="dishDetail" class="p-4">
        <div class="flex gap-4 mb-4">
          <div class="w-1/3" v-if="dishDetail.imageName">
            <Image :src="`/api/cooking/file/dish/${dishDetail.imageName}`" :width="240" :preview="false" />
          </div>
          <div class="w-2/3">
            <Descriptions :column="1" size="small" bordered>
              <Descriptions.Item label="菜品名稱">{{ dishDetail.name }}</Descriptions.Item>
              <Descriptions.Item label="所屬分類">{{ dishDetail.categoryName }}</Descriptions.Item>
              <Descriptions.Item label="難度等級">
                <Tag :color="difficultyMap[dishDetail.difficulty]?.color || 'default'">
                  {{ difficultyMap[dishDetail.difficulty]?.label || dishDetail.difficulty }}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="烹飪時間">{{ dishDetail.cookingTime }} 分鐘</Descriptions.Item>
              <Descriptions.Item label="平均評分">
                <a-rate :value="dishDetail.averageStarRating || 0" disabled allow-half />
                <span class="ml-2">{{ dishDetail.averageStarRating || '暫無評分' }}</span>
              </Descriptions.Item>
              <Descriptions.Item label="菜品描述">{{ dishDetail.description || '暫無描述' }}</Descriptions.Item>
            </Descriptions>
          </div>
        </div>

        <Divider orientation="left">配料表</Divider>
        <div class="mb-4">
          <a-table :dataSource="dishDetail.ingredients" :pagination="false" size="small" bordered>
            <a-table-column title="配料名稱" dataIndex="name" />
            <a-table-column title="份量" dataIndex="amount" />
          </a-table>
        </div>

        <Divider orientation="left">烹飪步驟</Divider>
        <div class="mb-4">
          <a-table :dataSource="dishDetail.steps" :pagination="false" size="small" bordered>
            <a-table-column title="步驟" dataIndex="stepNumber" width="80px" />
            <a-table-column title="說明" dataIndex="description" />
            <a-table-column title="圖片" dataIndex="imageUrl" width="120px">
              <template #default="{ text }">
                <Image v-if="text" :src="text" :width="100" />
                <span v-else>無圖片</span>
              </template>
            </a-table-column>
          </a-table>
        </div>

        <Divider orientation="left">烹飪小貼士</Divider>
        <div>
          <a-table :dataSource="dishDetail.tips" :pagination="false" size="small" bordered>
            <a-table-column title="小貼士" dataIndex="content" />
          </a-table>
        </div>
      </div>
    </a-spin>
  </Modal>
</template>