<script lang="ts" setup>
import type { CookingStepApi } from '#/api/cooking/step/index';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, Form as AForm, Input, InputNumber, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { batchCreateStep } from '#/api/cooking/step/index';
import { $t } from '#/locales';

import { useBatchFormSchema } from '../data';

const emit = defineEmits(['success']);

// 步驟列表
const steps = reactive<{ stepNumber: number; description: string }[]>([
  { stepNumber: 1, description: '' },
]);

const [Form, formApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    formItemClass: 'col-span-2',
    labelWidth: 80,
  },
  layout: 'horizontal',
  schema: useBatchFormSchema(),
  showDefaultActions: false,
});

// 添加步驟項
function addStepItem() {
  const nextStepNumber = steps.length > 0 
    ? Math.max(...steps.map(s => s.stepNumber)) + 1 
    : 1;
  steps.push({ stepNumber: nextStepNumber, description: '' });
}

// 刪除步驟項
function removeStepItem(index: number) {
  if (steps.length > 1) {
    steps.splice(index, 1);
  } else {
    message.warning('至少需要一個步驟');
  }
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    
    // 驗證步驟列表
    const validSteps = steps.filter(item => item.stepNumber && item.description);
    if (validSteps.length === 0) {
      message.error('請至少填寫一個步驟信息');
      return;
    }
    
    modalApi.lock();
    // 提交表單
    const values = await formApi.getValues();
    const data: CookingStepApi.BatchCreateStep = {
      dishId: values.dishId,
      steps: validSteps,
    };
    
    try {
      await batchCreateStep(data);
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
      // 重置步驟列表
      steps.splice(0, steps.length, { stepNumber: 1, description: '' });
      return;
    }
  },
});
</script>

<template>
  <Modal title="批量添加烹飪步驟">
    <Form class="mx-4">
      <template #steps>
        <div>
          <div
            v-for="(item, index) in steps"
            :key="index"
            class="flex items-center mb-3"
          >
            <AForm.Item
              :name="['steps', index, 'stepNumber']"
              class="mb-0 mr-2"
              :style="{ width: '100px' }"
              :rules="[{ required: true, message: '請輸入步驟順序' }]"
            >
              <InputNumber 
                v-model:value="item.stepNumber" 
                placeholder="步驟順序" 
                :min="1"
                style="width: 100%"
              />
            </AForm.Item>
            <AForm.Item
              :name="['steps', index, 'description']"
              class="mb-0 mr-2 flex-1"
              :rules="[{ required: true, message: '請輸入步驟描述' }]"
            >
              <Input v-model:value="item.description" placeholder="步驟描述" />
            </AForm.Item>
            <Button
              type="link"
              danger
              @click="removeStepItem(index)"
              :disabled="steps.length <= 1"
            >
              刪除
            </Button>
          </div>
          <Button type="dashed" block @click="addStepItem" class="mt-2">
            添加步驟
          </Button>
        </div>
      </template>
    </Form>
  </Modal>
</template> 