import { useRequest } from 'src/composes/request.compose';
import { useAuthStore } from 'src/store/modules/auth.module';

export function useMe() {
  const authStore = useAuthStore();
  const { request: fetchMe } = useRequest({
    method: 'get',
    url: '/api/me',
  });

  async function loadMe() {
    const [res, error] = await fetchMe();

    if (res) {
      authStore.setMe(res);
    }

    return [res, error];
  }

  return { loadMe };
}
