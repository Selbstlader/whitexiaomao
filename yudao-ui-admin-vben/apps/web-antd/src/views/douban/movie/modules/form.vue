<script lang="ts" setup>
import type { DoubanMovieApi } from '#/api/douban/movie';

import { computed, reactive, ref } from 'vue';

import { VbenButton, VbenModal } from '@vben/common-ui';
import { message } from 'ant-design-vue';

import { createMovie, updateMovie } from '#/api/douban/movie';
import { useFormSchema } from '../data';

interface Props {
  movieData?: DoubanMovieApi.Movie | null;
}

const props = withDefaults(defineProps<Props>(), {
  movieData: null,
});

const emit = defineEmits<{
  success: [];
}>();

const visible = defineModel<boolean>('visible', { default: false });

const loading = ref(false);
const formRef = ref();

const isUpdate = computed(() => !!props.movieData?.id);
const title = computed(() => (isUpdate.value ? '编辑电影' : '新增电影'));

const formData = reactive<Partial<DoubanMovieApi.Movie>>({
  title: '',
  director: '',
  actors: '',
  genre: '',
  releaseDate: '',
  rating: 0,
  description: '',
  poster: '',
  status: 1,
});

const formSchema = useFormSchema();

// 监听数据变化
watch(
  () => props.movieData,
  (data) => {
    if (data) {
      Object.assign(formData, data);
    } else {
      // 重置表单
      Object.assign(formData, {
        title: '',
        director: '',
        actors: '',
        genre: '',
        releaseDate: '',
        rating: 0,
        description: '',
        poster: '',
        status: 1,
      });
    }
  },
  { immediate: true },
);

async function handleSubmit() {
  try {
    loading.value = true;
    
    if (isUpdate.value) {
      await updateMovie({ ...formData, id: props.movieData!.id });
      message.success('更新成功');
    } else {
      await createMovie(formData as DoubanMovieApi.MovieCreateReq);
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
        <a-form-item label="电影标题" name="title" :rules="[{ required: true, message: '请输入电影标题' }]">
          <a-input v-model:value="formData.title" placeholder="请输入电影标题" />
        </a-form-item>
        
        <a-form-item label="导演" name="director" :rules="[{ required: true, message: '请输入导演' }]">
          <a-input v-model:value="formData.director" placeholder="请输入导演" />
        </a-form-item>
        
        <a-form-item label="主演" name="actors">
          <a-input v-model:value="formData.actors" placeholder="请输入主演" />
        </a-form-item>
        
        <a-form-item label="类型" name="genre">
          <a-input v-model:value="formData.genre" placeholder="请输入电影类型" />
        </a-form-item>
        
        <a-form-item label="上映日期" name="releaseDate">
          <a-date-picker v-model:value="formData.releaseDate" placeholder="请选择上映日期" />
        </a-form-item>
        
        <a-form-item label="评分" name="rating">
          <a-input-number v-model:value="formData.rating" :min="0" :max="10" :step="0.1" placeholder="请输入评分" />
        </a-form-item>
        
        <a-form-item label="简介" name="description">
          <a-textarea v-model:value="formData.description" placeholder="请输入电影简介" :rows="4" />
        </a-form-item>
        
        <a-form-item label="海报" name="poster">
          <a-input v-model:value="formData.poster" placeholder="请输入海报URL" />
        </a-form-item>
        
        <a-form-item label="状态" name="status">
          <a-select v-model:value="formData.status" placeholder="请选择状态">
            <a-select-option :value="1">启用</a-select-option>
            <a-select-option :value="0">禁用</a-select-option>
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