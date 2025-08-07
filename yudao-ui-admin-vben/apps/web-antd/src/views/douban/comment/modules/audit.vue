<script lang="ts" setup>
import type { DoubanCommentApi } from '#/api/douban/comment';

import { reactive, ref, watch } from 'vue';

import { VbenButton, VbenModal } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { auditComment } from '#/api/douban/comment';

interface Props {
  commentData?: DoubanCommentApi.Comment | null;
}

const props = withDefaults(defineProps<Props>(), {
  commentData: null,
});

const emit = defineEmits<{
  success: [];
}>();

const visible = defineModel<boolean>('visible', { default: false });

const loading = ref(false);
const formRef = ref();

const formData = reactive({
  status: 1, // 默认通过
  reason: '',
});

// 监听弹窗关闭，重置表单
watch(visible, (val) => {
  if (!val) {
    formData.status = 1;
    formData.reason = '';
  }
});

async function handleSubmit() {
  try {
    if (!props.commentData?.id) {
      message.error('评论信息错误');
      return;
    }
    
    loading.value = true;
    
    await auditComment({
      id: props.commentData.id,
      status: formData.status,
      auditReason: formData.reason,
    });
    
    message.success('审核成功');
    visible.value = false;
    emit('success');
  } catch (error) {
    console.error('审核失败:', error);
  } finally {
    loading.value = false;
  }
}

function handleCancel() {
  visible.value = false;
}
</script>

<template>
  <VbenModal
    v-model:open="visible"
    title="审核评论"
    :width="500"
    @cancel="handleCancel"
  >
    <div class="p-4">
      <div class="mb-4 p-3 bg-gray-50 rounded">
        <div class="text-sm text-gray-600 mb-2">评论内容：</div>
        <div class="text-gray-800">{{ commentData?.content }}</div>
        <div class="text-xs text-gray-500 mt-2">
          评分：{{ commentData?.rating }} 分 | 
          用户ID：{{ commentData?.userId }} | 
          电影ID：{{ commentData?.movieId }}
        </div>
      </div>
      
      <a-form
        ref="formRef"
        :model="formData"
        layout="vertical"
      >
        <a-form-item label="审核结果" name="status" :rules="[{ required: true, message: '请选择审核结果' }]">
          <a-radio-group v-model:value="formData.status">
            <a-radio :value="1">通过</a-radio>
            <a-radio :value="2">拒绝</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item 
          label="审核理由" 
          name="reason" 
          :rules="formData.status === 2 ? [{ required: true, message: '拒绝时请填写理由' }] : []"
        >
          <a-textarea 
            v-model:value="formData.reason" 
            placeholder="请输入审核理由（拒绝时必填）" 
            :rows="3" 
          />
        </a-form-item>
      </a-form>
    </div>
    
    <template #footer>
      <VbenButton @click="handleCancel">取消</VbenButton>
      <VbenButton type="primary" :loading="loading" @click="handleSubmit">
        确认审核
      </VbenButton>
    </template>
  </VbenModal>
</template>