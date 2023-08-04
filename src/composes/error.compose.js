import { ref } from 'vue';
import { useString } from './resource.compose';

export function useError() {
  const { getString } = useString();

  const error = ref();

  function setError(err) {
    if (err?.response?.data?.message) {
      error.value = err.response.data.message;
    } else if (err.message) {
      error.value = err.message;
    } else {
      error.value = getString('error.client');
    }
  }
  function resetError(err) {
    error.value = null;
  }

  return { error, setError, resetError };
}
