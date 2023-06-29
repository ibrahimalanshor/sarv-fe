import { createRouter, createWebHistory } from 'vue-router';
import { routes } from './routes';
import { useAuthGuard } from './guards/auth.guard';

export function setupRouter(app) {
  const router = createRouter({
    routes,
    history: createWebHistory(),
  });

  useAuthGuard(router);

  app.use(router);
}
