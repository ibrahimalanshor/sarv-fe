import axios from 'axios';
import { router } from 'src/router/router';
import { useAuthStore } from 'src/store/modules/auth.module';

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

http.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  if (authStore.isLoggedIn) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  return config;
});

http.interceptors.response.use(
  (res) => res,
  (error) => {
    const authStore = useAuthStore();

    if (error.response.status === 401) {
      authStore.logout();

      router.push({ name: 'login' });
    }

    return Promise.reject(error);
  }
);

export { http };
