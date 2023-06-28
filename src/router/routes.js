export const routes = [
  {
    path: '/',
    name: 'index',
    component: () => import('src/pages/index-page.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('src/pages/auth/auth-login-page.vue'),
    meta: {
      layout: 'LayoutAuth',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('src/pages/auth/auth-register-page.vue'),
    meta: {
      layout: 'LayoutAuth',
    },
  },
];
