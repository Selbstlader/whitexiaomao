// import type { RouteRecordRaw } from 'vue-router';

// const routes: RouteRecordRaw[] = [
//   {
//     path: '/douban',
//     name: 'Douban',
//     // component: () => import('#/layouts/index.vue'),
//     redirect: '/douban/movie',
//     meta: {
//       title: '豆瓣管理',
//       icon: 'mdi:movie-open',
//       orderNo: 1000,
//     },
//     children: [
//       {
//         path: 'movie',
//         name: 'DoubanMovie',
//         component: () => import('#/views/douban/movie/index.vue'),
//         meta: {
//           title: '电影管理',
//           icon: 'mdi:movie',
//           keepAlive: true,
//         },
//       },
//       {
//         path: 'user',
//         name: 'DoubanUser',
//         component: () => import('#/views/douban/user/index.vue'),
//         meta: {
//           title: '用户管理',
//           icon: 'mdi:account-group',
//           keepAlive: true,
//         },
//       },
//       {
//         path: 'comment',
//         name: 'DoubanComment',
//         component: () => import('#/views/douban/comment/index.vue'),
//         meta: {
//           title: '评论管理',
//           icon: 'mdi:comment-text-multiple',
//           keepAlive: true,
//         },
//       },
//     ],
//   },
// ];

// export default routes;