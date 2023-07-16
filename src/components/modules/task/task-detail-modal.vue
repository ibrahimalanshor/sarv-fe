<script setup>
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';
import BaseAlert from 'src/components/base/base-alert.vue';
import BaseModal from 'src/components/base/base-modal.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseSkeleton from 'src/components/base/base-skeleton.vue';
import BaseDescription from 'src/components/base/base-description.vue';
import { computed, ref, h } from 'vue';
import { formatDate, toDate } from 'src/utils/date';
import TaskEditModal from './task-edit-modal.vue';
import TaskDeleteConfirm from './task-delete-confirm.vue';
import TaskPriorityBadge from './task-priority-badge.vue';
import TaskStatusDropdown from 'src/components/modules/task-status/task-status-dropdown.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  taskId: {
    type: null,
    required: true,
  },
  formInputs: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits([
  'update:modelValue',
  'created',
  'updated',
  'deleted',
]);

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
const deleteConfirmVisible = ref(false);

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
      id: 'category',
      name: getString('task.attributes.category'),
      value: task.value.category ? task.value.category.name : '-',
    },
    {
      id: 'created_at',
      name: getString('task.attributes.created_at'),
      value: formatDate(task.value.created_at),
    },
    {
      id: 'due_date',
      name: getString('task.attributes.due_date'),
      value: task.value.due_date ? toDate(task.value.due_date) : '-',
    },
    {
      id: 'priority',
      name: getString('task.attributes.priority'),
    },
    {
      id: 'status',
      name: getString('task.attributes.status'),
    },
    {
      id: 'description',
      name: getString('task.attributes.description'),
      value: task.value.description ?? '-',
      fullwidth: true,
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
function handleDelete() {
  deleteConfirmVisible.value = true;
}
function handleUpdated() {
  loadTask();

  emit('updated');
}
function handleDeleted() {
  visible.value = false;

  emit('deleted');
}
function hanldeUpdatedStatus() {
  emit('updated');
}
</script>

<template>
  <base-modal
    :title="getString('task.actions.detail')"
    size="xl"
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
        <base-description :attributes="attributes" :data="task">
          <template #[`priority`]>
            <task-priority-badge v-if="task.priority" :task="task" />
            <span v-else>-</span>
          </template>
          <template #[`status`]>
            <task-status-dropdown
              :task="task"
              v-model="task.status"
              v-on:updated="hanldeUpdatedStatus"
            />
          </template>
        </base-description>
        <task-edit-modal
          :task="task"
          :inputs="props.formInputs"
          v-model="editModalVisible"
          v-on:updated="handleUpdated"
        />
        <task-delete-confirm
          :task="task"
          v-model="deleteConfirmVisible"
          v-on:deleted="handleDeleted"
        />
      </template>
    </div>

    <template #footer="{ close }">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-x-2">
          <base-button
            text="actions.edit"
            color="indigo"
            text-from-resource
            v-on:click="handleEdit"
          />
          <base-button
            text="actions.delete"
            color="red"
            text-from-resource
            v-on:click="handleDelete"
          />
        </div>
        <base-button
          text="actions.cancel"
          text-from-resource
          v-on:click="close"
        />
      </div>
    </template>
  </base-modal>
</template>
