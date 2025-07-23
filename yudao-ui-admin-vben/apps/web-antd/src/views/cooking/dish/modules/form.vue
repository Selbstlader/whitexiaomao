<script lang="ts" setup>
import type { CookingDishApi } from '#/api/cooking/dish/index';
import type { FileType, UploadFile } from 'ant-design-vue/es/upload/interface';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createDish, getDish, updateDish } from '#/api/cooking/dish/index';
import { requestClient } from '#/api/request';
import { $t } from '#/locales';

import { useFormSchema } from '../data';

const emit = defineEmits(['success']);
const formData = ref<CookingDishApi.Dish>();
const getTitle = computed(() => {
  return formData.value?.id
    ? $t('ui.actionTitle.edit', ['菜品'])
    : $t('ui.actionTitle.create', ['菜品']);
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
  
  previewImageUrl.value = `/api/cooking/file/dish/${imageName}`;
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
    
    try {
      if (values.id) {
        // 編輯模式
        if (values.imageFile) {
          // 有圖片，使用FormData
          const formData = new FormData();
          formData.append('categoryId', String(Number(values.categoryId)));
          formData.append('name', values.name);
          if (values.description) formData.append('description', values.description);
          formData.append('difficulty', String(Number(values.difficulty)));
          formData.append('cookingTime', String(Number(values.cookingTime)));
          formData.append('id', String(Number(values.id)));
          formData.append('imageFile', values.imageFile);
          await updateDish(formData);
        } else {
          // 無圖片，使用普通對象
          const updateData = {
            id: Number(values.id),
            categoryId: Number(values.categoryId),
            name: values.name,
            description: values.description || '',
            difficulty: Number(values.difficulty),
            cookingTime: Number(values.cookingTime)
          };
          await requestClient.put('/cooking/dish/update', updateData);
        }
      } else {
        // 創建模式
        const formData = new FormData();
        formData.append('categoryId', String(Number(values.categoryId)));
        formData.append('name', values.name);
        if (values.description) formData.append('description', values.description);
        formData.append('difficulty', String(Number(values.difficulty)));
        formData.append('cookingTime', String(Number(values.cookingTime)));
        if (values.imageFile) {
          formData.append('imageFile', values.imageFile);
        }
        await createDish(formData);
      }
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
    const data = modalApi.getData<CookingDishApi.Dish>();
    if (!data || !data.id) {
      return;
    }
    modalApi.lock();
    try {
      formData.value = await getDish(data.id as number);
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