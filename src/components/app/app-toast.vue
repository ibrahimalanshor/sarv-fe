<script setup>
import BaseToast from 'src/components/base/base-toast.vue';
import { useToastStore } from 'src/store/modules/toast.module';
import { computed } from 'vue';

const toastStore = useToastStore();
const toasts = computed(() => toastStore.toasts);

function handleClose(index) {
  toastStore.removeToast({ index });
}
</script>

<template>
  <div
    class="pointer-events-none fixed inset-0 flex flex-col px-4 py-6 sm:p-6 space-y-4"
  >
    <base-toast
      v-for="(toast, index) in toasts"
      :key="toast.id"
      :title="toast.title"
      :message="toast.message"
      :type="toast.type"
      v-on:close="handleClose(index)"
    />
  </div>
</template>
