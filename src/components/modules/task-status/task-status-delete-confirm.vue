<script setup>
import BaseConfirm from 'src/components/base/base-confirm.vue';
import { computed } from 'vue';
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  taskStatus: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'deleted']);

const { getString } = useString();
const {
  request: deleteTaskStatus,
  url: deleteTaskStatusUrl,
  loading: deleteTaskStatusLoading,
} = useRequest({
  method: 'delete',
  url: '/api/task-statuses/:id',
  notifyOnError: true,
});

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

async function handleConfirm() {
  deleteTaskStatusUrl.value = `/api/task-statuses/${props.taskStatus.id}`;

  const [success] = await deleteTaskStatus();

  if (success) {
    visible.value = false;

    emit('deleted');
  }
}
</script>

<template>
  <base-confirm
    :title="getString('task-status.actions.delete')"
    :message="getString('task-status.message.delete')"
    :action="getString('actions.delete')"
    type="danger"
    :loading="deleteTaskStatusLoading"
    v-model="visible"
    v-on:confirm="handleConfirm"
  />
</template>
