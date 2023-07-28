<script setup>
import { ref } from 'vue';
import BaseDropdown from 'src/components/base/base-dropdown.vue';
import { EllipsisVerticalIcon } from '@heroicons/vue/20/solid';
import { useTaskUpdateStatus } from 'src/composes/modules/task/task-update-status.compose';
import { TaskUnfinishedException } from 'src/exceptions/modules/task/task-unfinished.exception';
import WithTaskUnfinishedConfirm from 'src/components/compose/modules/with-task-unfinished-confirm.vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  actions: {
    type: Array,
    default: () => [],
  },
});
const emit = defineEmits(['updated']);

const { updateTaskStatus } = useTaskUpdateStatus();

const visibleUnfinishedDoneConfirm = ref(false);

async function handleClickAction(action) {
  const [success, error] = await updateTaskStatus(props.task, action.value);

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
    <base-dropdown
      :items="actions"
      size="sm"
      custom-width="w-fit"
      position="right"
      :text-wrap="false"
      v-on:click-item="(action) => handleClickAction(action)"
    >
      <template #toggle="{ toggle }">
        <button v-on:click="toggle">
          <ellipsis-vertical-icon class="w-5 h-5"></ellipsis-vertical-icon>
        </button>
      </template>
    </base-dropdown>
  </with-task-unfinished-confirm>
</template>
