<script setup>
import BaseInput from 'src/components/base/base-input.vue';
import { useRequest } from 'src/composes/request.compose';
import { reactive } from 'vue';

const props = defineProps({
  values: {
    type: Object,
    default: () => ({}),
  },
  inputSize: {
    type: String,
    default: 'md',
  },
});
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
  const [success] = await storeTask({
    ...form,
    ...props.values,
  });

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
      :size="props.inputSize"
      :color="storeTaskValidation.name ? 'red' : 'gray'"
      :message="storeTaskValidation.name"
      :loading="storeTaskLoading"
      :disabled="storeTaskLoading"
      placeholder-from-resource
      fullwidth
      with-right-content
      :with-label="false"
      v-model="form.name"
    />
  </form>
</template>
