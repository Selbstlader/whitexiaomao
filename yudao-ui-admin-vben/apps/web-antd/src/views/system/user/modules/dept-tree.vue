<script lang="ts" setup>
import type { SystemDeptApi } from '#/api/system/dept';

import { onMounted, ref } from 'vue';

import { Search } from '@vben/icons';
import { handleTree } from '@vben/utils';

import { Input, Tree } from 'ant-design-vue';

import { getSimpleDeptList } from '#/api/system/dept';

const emit = defineEmits(['select']);
const deptList = ref<SystemDeptApi.Dept[]>([]); // 部门列表
const deptTree = ref<any[]>([]); // 部门树
const expandedKeys = ref<number[]>([]); // 展开的节点
const loading = ref(false); // 加载状态
const searchValue = ref(''); // 搜索值

/** 处理搜索逻辑 */
function handleSearch(e: any) {
  const value = e.target.value;
  searchValue.value = value;
  const filteredList = value
    ? deptList.value.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase()),
      )
    : deptList.value;
  deptTree.value = handleTree(filteredList);
  // 展开所有节点
  expandedKeys.value = deptTree.value.map((node) => node.id as number);
}

/** 选中部门 */
const handleSelect = (_selectedKeys: any[], info: any) => {
  emit('select', info.node.dataRef);
};

/** 初始化 */
onMounted(async () => {
  try {
    loading.value = true;
    const data = await getSimpleDeptList();
    deptList.value = data;
    deptTree.value = handleTree(data);
  } catch (error) {
    console.error('获取部门数据失败', error);
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div>
    <div class="mb-2">
      <Input
        placeholder="搜索部门"
        allow-clear
        v-model:value="searchValue"
        @change="handleSearch"
        class="w-full"
      >
        <template #prefix>
          <Search class="size-4" />
        </template>
      </Input>
    </div>
    <Tree
      :spinning="loading"
      class="pt-2"
      v-if="deptTree.length > 0"
      :tree-data="deptTree"
      :field-names="{ title: 'name', key: 'id', children: 'children' }"
      @select="handleSelect"
      :default-expand-all="true"
    />
    <div v-else-if="!loading" class="py-4 text-center text-gray-500">
      暂无数据
    </div>
  </div>
</template>
