import { RouterView } from 'vue-router';

export const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('src/pages/index-page.vue'),
    meta: {
      layout: 'LayoutApp',
      title: 'index',
      requireAuth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('src/pages/auth/auth-login-page.vue'),
    meta: {
      layout: 'LayoutAuth',
      title: 'login',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('src/pages/auth/auth-register-page.vue'),
    meta: {
      layout: 'LayoutAuth',
      title: 'register',
    },
  },
  {
    path: '/task',
    component: RouterView,
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: '',
        component: () => import('src/pages/task/task-index-page.vue'),
        name: 'task.index',
        meta: {
          layout: 'LayoutApp',
          title: 'task.index',
        },
      },
    ],
  },
  {
    path: '/task-category',
    component: RouterView,
    meta: {
      requireAuth: true,
    },
    children: [
      {
        path: '',
        component: () =>
          import('src/pages/task-category/task-category-index-page.vue'),
        name: 'task-category.index',
        meta: {
          layout: 'LayoutApp',
          title: 'task-category.index',
        },
      },
    ],
  },
];
