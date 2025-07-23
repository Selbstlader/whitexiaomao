<script lang="ts" setup>
import type { CookingIngredientApi } from '#/api/cooking/ingredient/index';

import { computed, reactive, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, Form as AForm, Input, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { batchCreateIngredient } from '#/api/cooking/ingredient/index';
import { $t } from '#/locales';

import { useBatchFormSchema } from '../data';

const emit = defineEmits(['success']);

// 配料列表
const ingredients = reactive<{ name: string; amount: string }[]>([
  { name: '', amount: '' },
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

// 添加配料項
function addIngredientItem() {
  ingredients.push({ name: '', amount: '' });
}

// 刪除配料項
function removeIngredientItem(index: number) {
  if (ingredients.length > 1) {
    ingredients.splice(index, 1);
  } else {
    message.warning('至少需要一項配料');
  }
}

const [Modal, modalApi] = useVbenModal({
  async onConfirm() {
    const { valid } = await formApi.validate();
    if (!valid) {
      return;
    }
    
    // 驗證配料列表
    const validIngredients = ingredients.filter(item => item.name && item.amount);
    if (validIngredients.length === 0) {
      message.error('請至少填寫一項配料信息');
      return;
    }
    
    modalApi.lock();
    // 提交表單
    const values = await formApi.getValues();
    const data: CookingIngredientApi.BatchCreateIngredient = {
      dishId: values.dishId,
      ingredients: validIngredients,
    };
    
    try {
      await batchCreateIngredient(data);
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
      // 重置配料列表
      ingredients.splice(0, ingredients.length, { name: '', amount: '' });
      return;
    }
  },
});
</script>

<template>
  <Modal title="批量添加配料">
    <Form class="mx-4">
      <template #ingredients>
        <div>
          <div
            v-for="(item, index) in ingredients"
            :key="index"
            class="flex items-center mb-2"
          >
            <AForm.Item
              :name="['ingredients', index, 'name']"
              class="mb-0 mr-2 flex-1"
              :rules="[{ required: true, message: '請輸入配料名稱' }]"
            >
              <Input v-model:value="item.name" placeholder="配料名稱" />
            </AForm.Item>
            <AForm.Item
              :name="['ingredients', index, 'amount']"
              class="mb-0 mr-2 flex-1"
              :rules="[{ required: true, message: '請輸入配料份量' }]"
            >
              <Input v-model:value="item.amount" placeholder="配料份量" />
            </AForm.Item>
            <Button
              type="link"
              danger
              @click="removeIngredientItem(index)"
              :disabled="ingredients.length <= 1"
            >
              刪除
            </Button>
          </div>
          <Button type="dashed" block @click="addIngredientItem" class="mt-2">
            添加配料
          </Button>
        </div>
      </template>
    </Form>
  </Modal>
</template> 