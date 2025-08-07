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
  console.log('图片上传变化:', info);
  console.log('文件状态:', info.file.status);
  console.log('完整的info.file对象:', info.file);
  
  if (info.file.status === 'removed') {
    fileList.value = [];
    formApi.setFieldValue('imageFile', null);
    console.log('图片已移除，表单字段已清空');
    return;
  }

  // 确保获取正确的文件对象
  const file = info.file.originFileObj || info.file;
  console.log('获取的文件对象:', file);
  console.log('文件对象类型:', typeof file);
  console.log('是否为File实例:', file instanceof File);
  
  if (file && file instanceof File) {
    fileList.value = [info.file];
    // 直接设置原始文件对象，而不是包装对象
    formApi.setFieldValue('imageFile', file);
    console.log('图片文件已设置到表单:', file.name, file.size);
    
    // 验证设置是否成功
    setTimeout(async () => {
      const currentValues = await formApi.getValues();
      console.log('设置后的表单值:', currentValues.imageFile);
      console.log('imageFile是否为File:', currentValues.imageFile instanceof File);
    }, 100);
  } else {
    console.warn('未能获取到有效的文件对象，file:', file);
    console.warn('info.file.originFileObj:', info.file.originFileObj);
    console.warn('info.file:', info.file);
  }
}

// 初始化圖片預覽
function initImagePreview(imageName?: string) {
  if (!imageName) {
    fileList.value = [];
    formApi.setFieldValue('imageFile', null);
    return;
  }

  // ✨ 若已是完整 URL 直接使用，否则按旧规则拼接
  previewImageUrl.value = imageName.startsWith('http')
    ? imageName
    : `/api/cooking/file/dish/${imageName}`;

  fileList.value = [
    {
      uid: '-1',
      name: imageName,
      status: 'done',
      url: previewImageUrl.value,
    },
  ];
  // 编辑模式下，不设置imageFile，因为这是已存在的图片
  console.log('初始化图片预览:', imageName);
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
  
    const values = await formApi.getValues();
    
    // 构建FormData
    const formDataToSend = new FormData();
    
    // 添加基础字段
    formDataToSend.append('categoryId', String(Number(values.categoryId)));
    formDataToSend.append('name', values.name);
    if (values.description) formDataToSend.append('description', values.description);
    formDataToSend.append('difficulty', String(Number(values.difficulty)));
    formDataToSend.append('cookingTime', String(Number(values.cookingTime)));
    
    // 编辑模式添加ID
    if (values.id) {
      formDataToSend.append('id', String(Number(values.id)));
    }
    
    // 处理图片文件
    let actualImageFile: File | null = null;
    if (fileList.value.length > 0) {
      const fileItem = fileList.value[0];
      if (fileItem) {
        const fileCandidate = fileItem.originFileObj || fileItem;
        if (fileCandidate instanceof File) {
          actualImageFile = fileCandidate;
          formDataToSend.append('imageFile', actualImageFile);
        }
      }
    }
    
    try {
      if (values.id) {
        await updateDish(formDataToSend);
      } else {
        await createDish(formDataToSend);
      }
      
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
          accept="image/*"
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