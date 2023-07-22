<script setup>
import { computed } from 'vue';
import { useRequest } from 'src/composes/request.compose';
import TaskStatusDropdown from './task-status-dropdown.vue';

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
  url: updateTaskStatusUrl,
  loading: loadingUpdateTaskStatus,
  request: updateTaskStatus,
} = useRequest({
  method: 'patch',
  url: '/api/tasks',
  notifyOnError: true,
});

async function handleChange(value) {
  updateTaskStatusUrl.value = `/api/tasks/${props.task.id}/status`;

  const [success] = await updateTaskStatus({
    status: value,
  });

  if (success) {
    emit('updated');
  }
}
</script>

<template>
  <task-status-dropdown v-model="selected" v-on:change="handleChange" />
</template>
