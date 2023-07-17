<script setup>
import { computed } from 'vue';
import { useRequest } from 'src/composes/request.compose';
import TaskStatusSelect from './task-status-select.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  task: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'updated']);

const selected = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const {
  url: updateTaskUrl,
  loading: loadingUpdateTask,
  request: updateTask,
} = useRequest({
  method: 'patch',
  url: '/api/tasks',
  notifyOnError: true,
});

async function handleChange(value) {
  updateTaskUrl.value = `/api/tasks/${props.task.id}`;

  const [success] = await updateTask({
    name: props.task.name,
    status: value,
  });

  if (success) {
    emit('updated');
  }
}
</script>

<template>
  <task-status-select v-model="selected" v-on:change="handleChange" />
</template>
