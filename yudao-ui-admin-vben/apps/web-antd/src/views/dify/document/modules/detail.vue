<script lang="ts" setup>
import type { DifyDatasetApi } from '#/api/dify/dataset';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Descriptions, Tag } from 'ant-design-vue';

import { $t } from '#/locales';

const emit = defineEmits(['success']);
const formData = ref<DifyDatasetApi.Dataset>();

const getTitle = computed(() => {
  return '知识库详情';
});

const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      formData.value = modalApi.getData();
    }
  },
});

// 权限类型颜色映射
const getPermissionColor = (permission: string) => {
  const colorMap: Record<string, string> = {
    only_me: 'red',
    all_team_members: 'green',
    partial_members: 'orange',
  };
  return colorMap[permission] || 'default';
};

// 权限类型文本映射
const getPermissionText = (permission: string) => {
  const textMap: Record<string, string> = {
    only_me: '仅自己',
    all_team_members: '团队成员',
    partial_members: '部分成员',
  };
  return textMap[permission] || permission;
};

// 格式化日期
const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return '-';
  try {
    return new Date(dateStr).toLocaleString('zh-CN');
  } catch {
    return dateStr;
  }
};

defineExpose({
  modalApi,
});
</script>

<template>
  <Modal :title="getTitle" class="w-full" :footer="null">
    <div v-if="formData" class="p-4">
      <Descriptions :column="2" bordered>
        <Descriptions.Item label="知识库ID">
          {{ formData.id }}
        </Descriptions.Item>
        <Descriptions.Item label="知识库名称">
          {{ formData.name }}
        </Descriptions.Item>
        <Descriptions.Item label="描述" :span="2">
          {{ formData.description || '暂无描述' }}
        </Descriptions.Item>
        <Descriptions.Item label="权限类型">
          <Tag :color="getPermissionColor(formData.permission)">
            {{ getPermissionText(formData.permission) }}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="数据源类型">
          <Tag color="blue">
            {{ formData.dataSourceType || '未知' }}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="索引技术">
          <Tag color="green">
            {{ formData.indexingTechnique || '未知' }}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="应用数量">
          {{ formData.appCount || 0 }}
        </Descriptions.Item>
        <Descriptions.Item label="文档数量">
          {{ formData.documentCount || 0 }}
        </Descriptions.Item>
        <Descriptions.Item label="字数统计">
          {{ formData.wordCount || 0 }}
        </Descriptions.Item>
        <Descriptions.Item label="创建者">
          {{ formData.createdBy || '未知' }}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {{ formatDate(formData.createdAt) }}
        </Descriptions.Item>
        <Descriptions.Item label="更新时间">
          {{ formatDate(formData.updatedAt) }}
        </Descriptions.Item>
      </Descriptions>
    </div>
  </Modal>
</template>
