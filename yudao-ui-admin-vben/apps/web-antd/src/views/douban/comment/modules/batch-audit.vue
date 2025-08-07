<script lang="ts" setup>
import { reactive, ref, watch } from 'vue';

import { VbenButton, VbenModal } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { batchAuditComments } from '#/api/douban/comment';

interface Props {
  selectedIds?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  selectedIds: () => [],
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
    if (!props.selectedIds || props.selectedIds.length === 0) {
      message.error('请选择要审核的评论');
      return;
    }
    
    loading.value = true;
    
    await batchAuditComments({
      ids: props.selectedIds,
      status: formData.status,
      auditReason: formData.reason,
    });
    
    message.success(`批量审核成功，共处理 ${props.selectedIds.length} 条评论`);
    visible.value = false;
    emit('success');
  } catch (error) {
    console.error('批量审核失败:', error);
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
    title="批量审核评论"
    :width="500"
    @cancel="handleCancel"
  >
    <div class="p-4">
      <div class="mb-4 p-3 bg-blue-50 rounded">
        <div class="text-sm text-blue-600">
          已选择 <span class="font-semibold">{{ selectedIds?.length || 0 }}</span> 条评论进行批量审核
        </div>
      </div>
      
      <a-form
        ref="formRef"
        :model="formData"
        layout="vertical"
      >
        <a-form-item label="审核结果" name="status" :rules="[{ required: true, message: '请选择审核结果' }]">
          <a-radio-group v-model:value="formData.status">
            <a-radio :value="1">批量通过</a-radio>
            <a-radio :value="2">批量拒绝</a-radio>
          </a-radio-group>
        </a-form-item>
        
        <a-form-item 
          label="审核理由" 
          name="reason" 
          :rules="formData.status === 2 ? [{ required: true, message: '批量拒绝时请填写理由' }] : []"
        >
          <a-textarea 
            v-model:value="formData.reason" 
            placeholder="请输入审核理由（批量拒绝时必填）" 
            :rows="3" 
          />
        </a-form-item>
      </a-form>
    </div>
    
    <template #footer>
      <VbenButton @click="handleCancel">取消</VbenButton>
      <VbenButton type="primary" :loading="loading" @click="handleSubmit">
        确认批量审核
      </VbenButton>
    </template>
  </VbenModal>
</template>