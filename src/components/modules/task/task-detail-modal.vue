<script setup>
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';
import BaseAlert from 'src/components/base/base-alert.vue';
import BaseModal from 'src/components/base/base-modal.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseSkeleton from 'src/components/base/base-skeleton.vue';
import BaseDescription from 'src/components/base/base-description.vue';
import { computed, ref } from 'vue';
import { formatDate } from 'src/utils/date';
import TaskEditModal from './task-edit-modal.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  taskId: {
    type: null,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'created', 'updated']);

const { getString } = useString();
const {
  data: task,
  request: getTask,
  url: getTaskUrl,
  loading: getTaskLoading,
  error: getTaskError,
  resetError: resetGetTaskError,
} = useRequest({
  method: 'get',
  url: '/api/tasks',
  initData: {},
});

const editModalVisible = ref(false);
const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
const attributes = computed(() => {
  return [
    {
      id: 'name',
      name: getString('task.attributes.name'),
    },
    {
      id: 'created_at',
      name: getString('task.attributes.created_at'),
      value: formatDate(task.value.created_at),
    },
    {
      id: 'category',
      name: getString('task.attributes.category'),
      value: task.value.category ? task.value.category.name : '-',
    },
    {
      id: 'status',
      name: getString('task.attributes.status'),
      value: task.value.status ? task.value.status.name : '-',
    },
  ];
});

async function loadTask() {
  getTaskUrl.value = `/api/tasks/${props.taskId}`;

  await getTask({
    params: {
      include: ['category', 'status'],
    },
  });
}

function handleVisible() {
  resetGetTaskError();

  loadTask();
}
function handleCloseAlert() {
  resetGetTaskError();
}
function handleEdit() {
  editModalVisible.value = true;
}
function handleUpdated() {
  loadTask();

  emit('updated');
}
</script>

<template>
  <base-modal
    :title="getString('task.actions.detail')"
    size="lg"
    with-header
    with-footer
    v-model="visible"
    v-on:visible="handleVisible"
  >
    <div class="space-y-4">
      <base-skeleton v-if="getTaskLoading" />
      <template v-else>
        <base-alert
          :text="getTaskError"
          type="error"
          :force-visible="!!getTaskError"
          v-on:close="handleCloseAlert"
        />
        <base-description :attributes="attributes" :data="task" />
        <task-edit-modal
          :task="task"
          v-model="editModalVisible"
          v-on:updated="handleUpdated"
        />
      </template>
    </div>

    <template #footer="{ close }">
      <div class="flex items-center justify-end gap-x-2">
        <base-button
          text="actions.edit"
          color="indigo"
          text-from-resource
          v-on:click="handleEdit"
        />
        <base-button
          text="actions.cancel"
          text-from-resource
          v-on:click="close"
        />
      </div>
    </template>
  </base-modal>
</template>
