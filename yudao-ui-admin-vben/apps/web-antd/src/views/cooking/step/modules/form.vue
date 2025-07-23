<script lang="ts" setup>
import type { CookingStepApi } from '#/api/cooking/step/index';
import type { UploadFile } from 'ant-design-vue/es/upload/interface';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createStep, getStep, updateStep } from '#/api/cooking/step/index';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<CookingStepApi.Step>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['烹飪步驟'])
    : $t('ui.actionTitle.create', ['烹飪步驟']);
});

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useFormSchema(),
  showDefaultActions: false,
});

// 圖片預覽URL
const previewImageUrl = ref<string>('');
const fileList = ref<UploadFile[]>([]);

// 當圖片被更改時
function handleImageChange(info: any) {
  if (info.file.status === 'removed') {
    fileList.value = [];
    return;
  }
  
  fileList.value = [info.file];
  formApi.setFieldValue('imageFile', info.file.originFileObj);
}

// 初始化圖片預覽
function initImagePreview(imageName?: string) {
  if (!imageName) {
    fileList.value = [];
    return;
  }
  
  previewImageUrl.value = `/api/cooking/file/step/${imageName}`;
  fileList.value = [{
    uid: '-1',
    name: imageName,
    status: 'done',
    url: previewImageUrl.value,
  }];
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    
    // 提交表單
    const values = await formApi.getValues();
    const formData = new FormData();
    
    // 添加基本字段
    formData.append('dishId', values.dishId);
    formData.append('stepNumber', values.stepNumber);
    formData.append('description', values.description);
    
    // 如果是編輯模式，添加id
    if (values.id) {
      formData.append('id', values.id);
    }
    
    // 添加圖片文件
    if (values.imageFile) {
      formData.append('imageFile', values.imageFile);
    }
    
    try {
      await (values.id ? updateStep(formData) : createStep(formData));
      // 關閉並提示
      await modalApi.close();
      emit('success');
      message.success($t('ui.actionMessage.operationSuccess'));
    } finally {
      modalApi.unlock();
    }
  },
  async onOpenChange(isOpen: boolean) {
    if (!isOpen) {
      formData.value = undefined;
      fileList.value = [];
      return;
    }
    // 加載數據
    const data = modalApi.getData<CookingStepApi.Step>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getStep(data.id as number);
      // 設置到 values
      await formApi.setValues(formData.value);
      // 設置圖片預覽
      initImagePreview(formData.value.imageName);
    } finally {
      modalApi.unlock();
    }
  },
});
</script>

<template>
  <Modal :title="getTitle" width="600px">
    <Form class="mx-4">
      <template #imageFile>
        <a-upload
          v-model:file-list="fileList"
          list-type="picture-card"
          :max-count="1"
          :before-upload="() => false"
          @change="handleImageChange"
        >
          <div v-if="!fileList.length">
            <span class="ant-upload-text">上傳圖片</span>
          </div>
        </a-upload>
      </template>
    </Form>
  </Modal>
</template> 