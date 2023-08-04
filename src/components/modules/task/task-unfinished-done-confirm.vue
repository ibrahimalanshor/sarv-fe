<script setup>
import BaseConfirm from 'src/components/base/base-confirm.vue';
import { computed } from 'vue';
import { useTaskUpdateStatus } from 'src/composes/modules/task/task-update-status.compose';
import { getString } from 'src/utils/resource';

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
const emit = defineEmits(['update:modelValue', 'updated']);

const { loading, updateTaskStatus } = useTaskUpdateStatus({
  ignoreUnfinished: true,
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
  const [success] = await updateTaskStatus(props.task, 'done');

  if (success) {
    visible.value = false;

    emit('updated');
  }
}
</script>

<template>
  <base-confirm
    type="danger"
    :title="getString('task.titles.confirm-update-status')"
    :message="getString('task.messages.task-unfinished-done-confirm')"
    :action="getString('actions.confirm')"
    :loading="loading"
    v-model="visible"
    v-on:confirm="handleConfirm"
  />
</template>
