<script lang="ts" setup>
import type { FileType } from 'ant-design-vue/es/upload/interface';

import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { message, Upload } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { createDocumentByFile } from '#/api/dify/document';

const emit = defineEmits(['success']);

const formData = ref<any>();
const loading = ref(false);
const selectedFile = ref<File | null>(null);

// 表单配置 - 只支持新增文档
const formSchema = [
  {
    fieldName: 'name',
    label: '文档名称',
    component: 'Input',
    componentProps: {
      placeholder: '请输入文档名称（可选，不填则使用文件名）',
    },
  },
  {
    fieldName: 'file',
    label: '上传文件',
    component: 'Upload',
    componentProps: {
      placeholder: '请选择要上传的文件',
    },
    // 暂时移除 required 验证，因为我们使用自定义上传
    // rules: 'required',
    help: '支持 .pdf、.doc、.docx、.txt、.md、.xlsx、.xls、.pptx、.ppt 格式文件',
  },
];

// 创建表单实例
const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 120,
  },
  layout: 'horizontal',
  schema: formSchema,
  showDefaultActions: false,
});

// 创建模态框实例
const [Modal, modalApi] = useVbenModal({
  onOpenChange(isOpen: boolean) {
    if (isOpen) {
      const data = modalApi.getData();
      formData.value = { ...data };
      selectedFile.value = null; // 重置文件选择
      console.log('Modal opened with data:', data);
      // 重置表单
      formApi.resetForm();
    }
  },
});

/** 上传前处理 */
function beforeUpload(file: FileType) {
  console.log('beforeUpload called with file:', file);

  // 检查文件类型
  const allowedTypes = ['.pdf', '.doc', '.docx', '.txt', '.md', '.xlsx', '.xls', '.pptx', '.ppt'];
  const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();

  if (!allowedTypes.includes(fileExtension)) {
    message.error('不支持的文件格式');
    return false;
  }

  // 检查文件大小（限制为 50MB）
  const isLt50M = file.size / 1024 / 1024 < 50;
  if (!isLt50M) {
    message.error('文件大小不能超过 50MB');
    return false;
  }

  // 保存文件到表单
  selectedFile.value = file;
  formApi.setFieldValue('file', file);
  console.log('File saved:', selectedFile.value);
  return false; // 阻止自动上传
}

// 提交表单
async function handleSubmit() {
  console.log('handleSubmit called');
  console.log('formData:', formData.value);
  console.log('selectedFile:', selectedFile.value);

  try {
    debugger;
    // 验证表单
    console.log('Starting form validation...');
    const { valid } = await formApi.validate();
    console.log('Form validation result:', valid);

    if (!valid) {
      console.log('Form validation failed');
      return;
    }

    loading.value = true;
    const values = await formApi.getValues();
    console.log('Form values:', values);

    // 检查是否选择了文件
    if (!selectedFile.value) {
      console.log('No file selected');
      message.error('请选择要上传的文件');
      return;
    }

    console.log('Creating document with file:', selectedFile.value);
    console.log('Dataset ID:', formData.value?.datasetId);
    console.log('Document name:', values.name || selectedFile.value.name);

    // 通过文件创建文档
    const result = await createDocumentByFile(
      formData.value?.datasetId!,
      selectedFile.value,
      values.name || selectedFile.value.name
    );

    console.log('Document created successfully:', result);
    message.success('文档创建成功');

    modalApi.close();
    emit('success');
  } catch (error) {
    console.error('操作失败:', error);
    message.error('操作失败: ' + (error as Error).message);
  } finally {
    loading.value = false;
  }
}

defineExpose({
  modalApi,
});
</script>

<template>
  <Modal
    title="新增文档"
    class="w-full"
    :loading="loading"
  >
    <Form v-if="formData" class="mx-4">
      <template #file>
        <div class="w-full">
          <Upload.Dragger
            name="file"
            :max-count="1"
            accept=".pdf,.doc,.docx,.txt,.md,.xlsx,.xls,.pptx,.ppt"
            :before-upload="beforeUpload"
            list-type="text"
          >
            <p class="ant-upload-drag-icon">
              <span class="icon-[ant-design--inbox-outlined] text-2xl"></span>
            </p>
            <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p class="ant-upload-hint">
              支持 .pdf、.doc、.docx、.txt、.md、.xlsx、.xls、.pptx、.ppt 格式文件，文件大小不超过 50MB
            </p>
          </Upload.Dragger>
        </div>
      </template>
    </Form>
  </Modal>
</template>
