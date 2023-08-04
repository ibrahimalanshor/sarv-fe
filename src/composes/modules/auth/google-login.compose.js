import { useRequest } from 'src/composes/request.compose';
import { useAuthStore } from 'src/store/modules/auth.module';
import { googleTokenLogin } from 'vue3-google-login';

export function useGoogleLogin() {
  const authStore = useAuthStore();
  const { loading, request } = useRequest({
    method: 'post',
    url: '/api/auth-social/google',
    notifyOnError: true,
    initLoading: false,
  });

  async function googleLogin() {
    try {
      const { access_token } = await googleTokenLogin({
        clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      });

      const [res, error] = await request({ token: access_token });

      if (res) {
        authStore.login({
          token: res.token.token,
          me: res.user,
        });
      }

      return [res, error];
    } catch (err) {
      return [null, err];
    }
  }

  return { loading, googleLogin };
}
