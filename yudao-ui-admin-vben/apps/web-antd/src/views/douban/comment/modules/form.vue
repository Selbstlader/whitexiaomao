<script lang="ts" setup>
import type { DoubanCommentApi } from '#/api/douban/comment';

import { computed, reactive, ref, watch } from 'vue';

import { VbenButton, VbenModal } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { createComment, updateComment } from '#/api/douban/comment';

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

const isUpdate = computed(() => !!props.commentData?.id);
const title = computed(() => (isUpdate.value ? '编辑评论' : '新增评论'));

const formData = reactive<Partial<DoubanCommentApi.Comment>>({
  movieId: undefined,
  userId: undefined,
  content: '',
  rating: 5,
  status: 0,
});

// 监听数据变化
watch(
  () => props.commentData,
  (data) => {
    if (data) {
      Object.assign(formData, data);
    } else {
      // 重置表单
      Object.assign(formData, {
        movieId: undefined,
        userId: undefined,
        content: '',
        rating: 5,
        status: 0,
      });
    }
  },
  { immediate: true },
);

async function handleSubmit() {
  try {
    loading.value = true;
    
    if (isUpdate.value) {
      await updateComment({ ...formData, id: props.commentData!.id! });
      message.success('更新成功');
    } else {
      await createComment(formData as DoubanCommentApi.CommentCreateReq);
      message.success('创建成功');
    }
    
    visible.value = false;
    emit('success');
  } catch (error) {
    console.error('操作失败:', error);
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
    :title="title"
    :width="600"
    @cancel="handleCancel"
  >
    <div class="p-4">
      <a-form
        ref="formRef"
        :model="formData"
        layout="vertical"
      >
        <a-form-item label="电影ID" name="movieId" :rules="[{ required: true, message: '请输入电影ID' }]">
          <a-input-number v-model:value="formData.movieId" placeholder="请输入电影ID" :disabled="isUpdate" />
        </a-form-item>
        
        <a-form-item label="用户ID" name="userId" :rules="[{ required: true, message: '请输入用户ID' }]">
          <a-input-number v-model:value="formData.userId" placeholder="请输入用户ID" :disabled="isUpdate" />
        </a-form-item>
        
        <a-form-item label="评论内容" name="content" :rules="[{ required: true, message: '请输入评论内容' }]">
          <a-textarea v-model:value="formData.content" placeholder="请输入评论内容" :rows="4" />
        </a-form-item>
        
        <a-form-item label="评分" name="rating">
          <a-rate v-model:value="formData.rating" :count="10" allow-half />
          <span class="ml-2">{{ formData.rating }} 分</span>
        </a-form-item>
        
        <a-form-item label="状态" name="status">
          <a-select v-model:value="formData.status" placeholder="请选择状态">
            <a-select-option :value="0">待审核</a-select-option>
            <a-select-option :value="1">已通过</a-select-option>
            <a-select-option :value="2">已拒绝</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </div>
    
    <template #footer>
      <VbenButton @click="handleCancel">取消</VbenButton>
      <VbenButton type="primary" :loading="loading" @click="handleSubmit">
        {{ isUpdate ? '更新' : '创建' }}
      </VbenButton>
    </template>
  </VbenModal>
</template>