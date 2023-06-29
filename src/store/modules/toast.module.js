import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useToastStore = defineStore('toast', () => {
  const toasts = ref([]);
  const maxLength = 4;

  async function createToast({
    id,
    title,
    message,
    type = 'success',
    autoclose = true,
  }) {
    if (toasts.value.length >= maxLength) {
      toasts.value.shift();
    }

    toasts.value.push({ id: id ?? Date.now(), title, message, type });

    if (autoclose) {
      setTimeout(() => {
        removeToast({ index: toasts.value.length - 1 });
      }, 2000);
    }
  }

  function removeToast({ index }) {
    toasts.value.splice(index, 1);
  }

  return { toasts, createToast, removeToast };
});
