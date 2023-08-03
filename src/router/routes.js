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
    path: '/profile',
    name: 'profile',
    component: () => import('src/pages/profile-page.vue'),
    meta: {
      layout: 'LayoutApp',
      title: 'profile',
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
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('src/pages/auth/auth-forgot-password-page.vue'),
    meta: {
      layout: 'LayoutAuth',
      title: 'forgot-password',
    },
  },
  {
    path: '/task',
    component: RouterView,
    meta: {
      requireAuth: true,
      title: 'task.index',
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
      {
        path: ':id',
        component: () => import('src/pages/task/task-detail-page.vue'),
        name: 'task.detail',
        meta: {
          layout: 'LayoutApp',
          title: 'task.detail',
          breadcrumb: false,
        },
      },
    ],
  },
  {
    path: '/category',
    component: RouterView,
    meta: {
      requireAuth: true,
      title: 'task-category.index',
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
      {
        path: ':id',
        component: () =>
          import('src/pages/task-category/task-category-detail-page.vue'),
        name: 'task-category.detail',
        meta: {
          layout: 'LayoutApp',
          title: 'task-category.detail',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404',
    component: () => import('src/pages/not-found-page.vue'),
    meta: {
      layout: 'LayoutState',
      title: '404',
    },
  },
];
