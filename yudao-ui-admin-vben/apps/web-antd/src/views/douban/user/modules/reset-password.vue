<script lang="ts" setup>
import type { DoubanUserApi } from '#/api/douban/user';

import { reactive, ref, watch } from 'vue';

import { VbenButton, VbenModal } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { resetUserPassword } from '#/api/douban/user';

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

const formData = reactive({
  password: '',
  confirmPassword: '',
});

// 监听弹窗关闭，重置表单
watch(visible, (val) => {
  if (!val) {
    formData.password = '';
    formData.confirmPassword = '';
  }
});

async function handleSubmit() {
  try {
    // 验证表单
    if (!formData.password) {
      message.error('请输入新密码');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }
    
    if (!props.userData?.id) {
      message.error('用户信息错误');
      return;
    }
    
    loading.value = true;
    
    await resetUserPassword({
      id: props.userData.id,
      password: formData.password,
    });
    
    message.success('密码重置成功');
    visible.value = false;
    emit('success');
  } catch (error) {
    console.error('密码重置失败:', error);
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
    title="重置密码"
    :width="400"
    @cancel="handleCancel"
  >
    <div class="p-4">
      <a-form
        ref="formRef"
        :model="formData"
        layout="vertical"
      >
        <a-form-item label="用户名">
          <a-input :value="userData?.username" disabled />
        </a-form-item>
        
        <a-form-item 
          label="新密码" 
          name="password" 
          :rules="[{ required: true, message: '请输入新密码' }, { min: 6, message: '密码长度至少6位' }]"
        >
          <a-input-password v-model:value="formData.password" placeholder="请输入新密码" />
        </a-form-item>
        
        <a-form-item 
          label="确认密码" 
          name="confirmPassword" 
          :rules="[{ required: true, message: '请确认密码' }]"
        >
          <a-input-password v-model:value="formData.confirmPassword" placeholder="请再次输入新密码" />
        </a-form-item>
      </a-form>
    </div>
    
    <template #footer>
      <VbenButton @click="handleCancel">取消</VbenButton>
      <VbenButton type="primary" :loading="loading" @click="handleSubmit">
        确认重置
      </VbenButton>
    </template>
  </VbenModal>
</template>