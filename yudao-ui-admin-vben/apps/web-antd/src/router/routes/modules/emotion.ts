import type { RouteRecordRaw } from 'vue-router';

import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'lucide:heart',
      order: 1,
      title: 'AI情感咨询',
    },
    name: 'Emotion',
    path: '/emotion',
    children: [
      {
        name: 'EmotionHome',
        path: '/home',
        component: () => import('#/views/emotion/home/index.vue'),
        meta: {
          affixTab: true,
          icon: 'lucide:home',
          title: '首页',
        },
      },
      {
        name: 'EmotionChat',
        path: '/chat',
        component: () => import('#/views/emotion/chat/index.vue'),
        meta: {
          icon: 'lucide:message-circle',
          title: '情感聊天',
        },
      },
    ],
  },
];

export default routes;
