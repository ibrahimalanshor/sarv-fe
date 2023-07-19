import { useRequest } from 'src/composes/request.compose';
import { useAuthStore } from 'src/store/modules/auth.module';

export function useLogout() {
  const authStore = useAuthStore();
  const { error, loading, request, resetError } = useRequest({
    method: 'post',
    url: '/api/logout',
  });

  async function logout() {
    const [res, error] = await request();

    if (res) {
      authStore.logout();
    }

    return [res, error];
  }

  return { error, loading, logout, resetError };
}
