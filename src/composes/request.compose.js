import { ref } from 'vue';
import { useError } from './error.compose';
import { useValidation } from './validation.compose';
import { http } from 'src/helpers/http';

export function useRequest({ method, url }) {
  const { error, setError, resetError } = useError();
  const { validation, setValidation, resetValidation } = useValidation();

  const loading = ref(false);

  async function request(params) {
    loading.value = true;
    resetError();
    resetValidation();

    try {
      const res = await http[method](url, params);

      return [res.data, null];
    } catch (err) {
      if (err.response?.status === 422) {
        setValidation(err.response.data.errors);
      } else {
        setError(err);
      }

      return [false, error.value];
    } finally {
      loading.value = false;
    }
  }

  return { error, validation, loading, request, resetError };
}
