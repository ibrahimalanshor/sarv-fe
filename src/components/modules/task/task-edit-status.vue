<script setup>
import { computed, ref } from 'vue';
import { useTaskUpdateStatus } from 'src/composes/modules/task/task-update-status.compose';
import { TaskUnfinishedException } from 'src/exceptions/modules/task/task-unfinished.exception';
import TaskStatusDropdown from './task-status-dropdown.vue';
import WithTaskUnfinishedConfirm from 'src/components/compose/modules/with-task-unfinished-confirm.vue';

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  task: {
    type: Object,
    required: true,
  },
  buttonSize: {
    type: String,
    default: 'sm',
  },
});
const emit = defineEmits(['update:modelValue', 'updated']);

const { updateTaskStatus } = useTaskUpdateStatus();

const visibleUnfinishedDoneConfirm = ref(false);

const selected = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

async function handleChange(value) {
  const [success, error] = await updateTaskStatus(props.task, value);

  if (!success) {
    if (error instanceof TaskUnfinishedException) {
      visibleUnfinishedDoneConfirm.value = true;
    }
  } else {
    emit('updated');
  }
}
function handleUpdated() {
  emit('updated');
}
</script>

<template>
  <with-task-unfinished-confirm
    :task="props.task"
    v-model="visibleUnfinishedDoneConfirm"
    v-on:updated="handleUpdated"
  >
    <task-status-dropdown
      :button-size="props.buttonSize"
      :task="props.task"
      v-on:change="handleChange"
    />
  </with-task-unfinished-confirm>
</template>
