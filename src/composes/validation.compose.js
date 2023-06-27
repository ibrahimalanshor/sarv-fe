import { ref } from 'vue';

export function useValidation() {
  const validation = ref({});

  function setValidation(err) {
    validation.value = err.reduce((res, error) => {
      if (!res[error.field]) {
        res[error.field] = error.message;
      }

      return res;
    }, {});
  }
  function resetValidation() {
    validation.value = {};
  }

  return { validation, setValidation, resetValidation };
}
