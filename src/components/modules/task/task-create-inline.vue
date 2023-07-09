<script setup>
import BaseInput from 'src/components/base/base-input.vue';
import { useRequest } from 'src/composes/request.compose';
import { reactive } from 'vue';

const emit = defineEmits(['created']);

const {
  request: storeTask,
  loading: storeTaskLoading,
  validation: storeTaskValidation,
} = useRequest({
  method: 'post',
  url: '/api/tasks',
  notifyOnError: true,
});

const form = reactive({
  name: null,
});

function resetForm() {
  form.name = null;
}

async function handleSubmit() {
  const [success] = await storeTask(form);

  if (success) {
    resetForm();

    emit('created');
  }
}
</script>

<template>
  <form v-on:submit.prevent="handleSubmit">
    <base-input
      type="text"
      placeholder="task.placeholder.new-task"
      :color="storeTaskValidation.name ? 'red' : 'gray'"
      :message="storeTaskValidation.name"
      :loading="storeTaskLoading"
      :disabled="storeTaskLoading"
      with-right-content
      placeholder-from-resource
      fullwidth
      :with-label="false"
      v-model="form.name"
    />
  </form>
</template>
