<script lang="ts" setup>
import type { CookingTipApi } from '#/api/cooking/tip/index';

import { reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, Form as AForm, Input, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { batchCreateTip } from '#/api/cooking/tip/index';
import { $t } from '#/locales';

import { useBatchFormSchema } from '../data';

const emit = defineEmits(['success']);

// 小貼士列表
const tips = reactive<{ content: string }[]>([
  { content: '' },
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

// 添加小貼士項
function addTipItem() {
  tips.push({ content: '' });
}

// 刪除小貼士項
function removeTipItem(index: number) {
  if (tips.length > 1) {
    tips.splice(index, 1);
  } else {
    message.warning('至少需要一項小貼士');
  }
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    
    // 驗證小貼士列表
    const validTips = tips.filter(item => item.content);
    if (validTips.length === 0) {
      message.error('請至少填寫一項小貼士內容');
      return;
    }
    
    modalApi.lock();
    // 提交表單
    const values = await formApi.getValues();
    const data: CookingTipApi.BatchCreateTip = {
      dishId: values.dishId,
      tips: validTips,
    };
    
    try {
      await batchCreateTip(data);
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
      // 重置小貼士列表
      tips.splice(0, tips.length, { content: '' });
      return;
    }
  },
});
</script>

<template>
  <Modal title="批量添加烹飪小貼士">
    <Form class="mx-4">
      <template #tips>
        <div>
          <div
            v-for="(item, index) in tips"
            :key="index"
            class="flex items-center mb-3"
          >
            <AForm.Item
              :name="['tips', index, 'content']"
              class="mb-0 mr-2 flex-1"
              :rules="[{ required: true, message: '請輸入小貼士內容' }]"
            >
              <Input v-model:value="item.content" placeholder="小貼士內容" />
            </AForm.Item>
            <Button
              type="link"
              danger
              @click="removeTipItem(index)"
              :disabled="tips.length <= 1"
            >
              刪除
            </Button>
          </div>
          <Button type="dashed" block @click="addTipItem" class="mt-2">
            添加小貼士
          </Button>
        </div>
      </template>
    </Form>
  </Modal>
</template> 