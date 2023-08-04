import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { useAuthGuard } from './guards/auth.guard';

const router = createRouter({
  routes,
  history: createWebHistory(),
});

useAuthGuard(router);

export { router };
