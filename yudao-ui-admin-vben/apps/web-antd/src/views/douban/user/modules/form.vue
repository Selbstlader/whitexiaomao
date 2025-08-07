<script lang="ts" setup>
import type { DoubanUserApi } from '#/api/douban/user';

import { computed, reactive, ref, watch } from 'vue';

import { VbenButton, VbenModal } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { createUser, updateUser } from '#/api/douban/user';

interface Props {
  userData?: DoubanUserApi.User | null;
}

const props = withDefaults(defineProps<Props>(), {
  userData: null,
});

const emit = defineEmits<{
  success: [];
}>();

const visible = defineModel<boolean>('visible', { default: false });

const loading = ref(false);
const formRef = ref();

const isUpdate = computed(() => !!props.userData?.id);
const title = computed(() => (isUpdate.value ? '编辑用户' : '新增用户'));

const formData = reactive<Partial<DoubanUserApi.User>>({
  username: '',
  email: '',
  nickname: '',
  avatar: '',
  status: 1,
  remark: '',
});

// 监听数据变化
watch(
  () => props.userData,
  (data) => {
    if (data) {
      Object.assign(formData, data);
    } else {
      // 重置表单
      Object.assign(formData, {
        username: '',
        email: '',
        nickname: '',
        avatar: '',
        status: 1,
        remark: '',
      });
    }
  },
  { immediate: true },
);

async function handleSubmit() {
  try {
    loading.value = true;
    
    if (isUpdate.value) {
      await updateUser({ ...formData, id: props.userData!.id! });
      message.success('更新成功');
    } else {
      await createUser(formData as DoubanUserApi.UserCreateReq);
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
        <a-form-item label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
          <a-input v-model:value="formData.username" placeholder="请输入用户名" :disabled="isUpdate" />
        </a-form-item>
        
        <a-form-item label="邮箱" name="email" :rules="[{ required: true, message: '请输入邮箱' }, { type: 'email', message: '请输入正确的邮箱格式' }]">
          <a-input v-model:value="formData.email" placeholder="请输入邮箱" />
        </a-form-item>
        
        <a-form-item label="昵称" name="nickname">
          <a-input v-model:value="formData.nickname" placeholder="请输入昵称" />
        </a-form-item>
        
        <a-form-item label="头像" name="avatar">
          <a-input v-model:value="formData.avatar" placeholder="请输入头像URL" />
        </a-form-item>
        
        <a-form-item label="状态" name="status">
          <a-select v-model:value="formData.status" placeholder="请选择状态">
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="0">禁用</a-select-option>
          </a-select>
        </a-form-item>
        
        <a-form-item label="备注" name="remark">
          <a-textarea v-model:value="formData.remark" placeholder="请输入备注" :rows="3" />
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