<script lang="ts" setup>
import type { DifyDocumentApi } from '#/api/dify/document';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Descriptions, Tag } from 'ant-design-vue';

const emit = defineEmits(['success']);
const formData = ref<DifyDocumentApi.Document & { datasetId?: string }>();

const getTitle = computed(() => {
  return '文档详情';
});

const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      formData.value = modalApi.getData();
    }
  },
});

// 数据源类型映射
const getDataSourceTypeText = (type: string) => {
  const typeMap: Record<string, string> = {
    upload_file: '上传文件',
    notion_import: 'Notion导入',
    website_crawl: '网站爬取',
    text_input: '文本输入',
  };
  return typeMap[type] || type || '未知';
};

// 状态颜色映射
const getStatusColor = (enabled: boolean) => {
  return enabled ? 'green' : 'red';
};

// 处理状态颜色映射
const getIndexingStatusColor = (status: string) => {
  const colorMap: Record<string, string> = {
    completed: 'green',
    available: 'green',
    processing: 'blue',
    error: 'red',
    paused: 'orange',
    waiting: 'default',
  };
  return colorMap[status] || 'default';
};

// 处理状态文本映射
const getIndexingStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    completed: '已完成',
    available: '可用',
    processing: '处理中',
    error: '处理失败',
    paused: '已暂停',
    waiting: '等待中',
  };
  return statusMap[status] || status || '未知';
};

// 格式化日期
const formatDate = (timestamp: number | string | undefined) => {
  if (!timestamp) return '-';
  try {
    // 如果是数字，认为是时间戳（秒）
    if (typeof timestamp === 'number') {
      return new Date(timestamp * 1000).toLocaleString('zh-CN');
    }
    // 如果是字符串，尝试解析
    return new Date(timestamp).toLocaleString('zh-CN');
  } catch {
    return timestamp?.toString() || '-';
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
        <Descriptions.Item label="文档ID">
          {{ formData.id }}
        </Descriptions.Item>
        <Descriptions.Item label="文档名称">
          {{ formData.name }}
        </Descriptions.Item>
        <Descriptions.Item label="数据源类型">
          <Tag color="blue">
            {{ getDataSourceTypeText(formData.data_source_type || '') }}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag :color="getStatusColor(formData.enabled || false)">
            {{ formData.enabled ? '启用' : '禁用' }}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="处理状态">
          <Tag :color="getIndexingStatusColor(formData.display_status || formData.indexing_status || '')">
            {{ getIndexingStatusText(formData.display_status || formData.indexing_status || '') }}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="文档格式">
          {{ formData.doc_form || '未知' }}
        </Descriptions.Item>
        <Descriptions.Item label="字数统计">
          {{ formData.word_count || 0 }}
        </Descriptions.Item>
        <Descriptions.Item label="命中次数">
          {{ formData.hit_count || 0 }}
        </Descriptions.Item>
        <Descriptions.Item label="Token数量">
          {{ formData.tokens || 0 }}
        </Descriptions.Item>
        <Descriptions.Item label="位置">
          {{ formData.position || 0 }}
        </Descriptions.Item>
        <Descriptions.Item label="是否归档">
          <Tag :color="formData.archived ? 'orange' : 'green'">
            {{ formData.archived ? '已归档' : '未归档' }}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="创建来源">
          {{ formData.created_from || '未知' }}
        </Descriptions.Item>
        <Descriptions.Item label="创建者">
          {{ formData.created_by || '未知' }}
        </Descriptions.Item>
        <Descriptions.Item label="创建时间">
          {{ formatDate(formData.created_at) }}
        </Descriptions.Item>
        <Descriptions.Item label="处理规则ID">
          {{ formData.dataset_process_rule_id || '-' }}
        </Descriptions.Item>
        <Descriptions.Item v-if="formData.disabled_at" label="禁用时间">
          {{ formatDate(formData.disabled_at) }}
        </Descriptions.Item>
        <Descriptions.Item v-if="formData.disabled_by" label="禁用者">
          {{ formData.disabled_by }}
        </Descriptions.Item>
        <Descriptions.Item v-if="formData.error" label="错误信息" :span="2">
          <Tag color="red">{{ formData.error }}</Tag>
        </Descriptions.Item>
      </Descriptions>
    </div>
  </Modal>
</template>
