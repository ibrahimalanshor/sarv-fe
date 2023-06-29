import { useRequest } from 'src/composes/request.compose';
import { useAuthStore } from 'src/store/modules/auth.module';

export function useRegister() {
  const authStore = useAuthStore();
  const { validation, error, loading, request, resetError } = useRequest({
    method: 'post',
    url: '/api/register',
  });

  async function register(credential) {
    const [res, error] = await request(credential);

    if (res) {
      authStore.login({
        token: res.token.token,
        me: res.user,
      });
    }

    return [res, error];
  }

  return { validation, error, loading, register, resetError };
}
