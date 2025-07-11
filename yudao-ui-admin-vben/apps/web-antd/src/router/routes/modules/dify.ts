import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/dify/document/:datasetId/documents',
    name: 'DifyDocumentManagement',
    component: () => import('#/views/dify/document/documents.vue'),
    meta: {
      title: '文档管理',
      hideInMenu: true,
      hideInTab: false,
      keepAlive: true,
      activePath: '/dify/document',
    },
  },
];

export default routes;
