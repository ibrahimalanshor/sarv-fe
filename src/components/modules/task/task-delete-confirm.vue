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
  task: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'deleted']);

const { getString } = useString();
const {
  request: deleteTask,
  url: deleteTaskUrl,
  loading: deleteTaskLoading,
} = useRequest({
  method: 'delete',
  url: '/api/tasks/:id',
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
  deleteTaskUrl.value = `/api/tasks/${props.task.id}`;

  const [success] = await deleteTask();

  if (success) {
    visible.value = false;

    emit('deleted');
  }
}
</script>

<template>
  <base-confirm
    :title="getString('task.actions.delete')"
    :message="getString('task.message.delete')"
    :action="getString('actions.delete')"
    type="danger"
    :loading="deleteTaskLoading"
    v-model="visible"
    v-on:confirm="handleConfirm"
  />
</template>
