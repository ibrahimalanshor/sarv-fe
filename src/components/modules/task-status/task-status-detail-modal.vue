<script setup>
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';
import BaseAlert from 'src/components/base/base-alert.vue';
import BaseModal from 'src/components/base/base-modal.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseSkeleton from 'src/components/base/base-skeleton.vue';
import BaseDescription from 'src/components/base/base-description.vue';
import { computed, ref } from 'vue';
import TaskStatusEditModal from './task-status-edit-modal.vue';
import TaskStatusDeleteConfirm from './task-status-delete-confirm.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  taskStatusId: {
    type: null,
    required: true,
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
  data: taskStatus,
  request: getTaskStatus,
  url: getTaskStatusUrl,
  loading: getTaskStatusLoading,
  error: getTaskStatusError,
  resetError: resetGetTaskStatusError,
} = useRequest({
  method: 'get',
  url: '/api/task-statuses',
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
      name: getString('task-status.attributes.name'),
    },
  ];
});

async function loadTaskStatus() {
  getTaskStatusUrl.value = `/api/task-statuses/${props.taskStatusId}`;

  await getTaskStatus();
}

function handleVisible() {
  resetGetTaskStatusError();

  loadTaskStatus();
}
function handleCloseAlert() {
  resetGetTaskStatusError();
}
function handleEdit() {
  editModalVisible.value = true;
}
function handleDelete() {
  deleteConfirmVisible.value = true;
}
function handleUpdated() {
  loadTaskStatus();

  emit('updated');
}
function handleDeleted() {
  visible.value = false;

  emit('deleted');
}
</script>

<template>
  <base-modal
    :title="getString('task-status.actions.detail')"
    size="lg"
    with-header
    with-footer
    v-model="visible"
    v-on:visible="handleVisible"
  >
    <div class="space-y-4">
      <base-skeleton v-if="getTaskStatusLoading" />
      <template v-else>
        <base-alert
          :text="getTaskStatusError"
          type="error"
          :force-visible="!!getTaskStatusError"
          v-on:close="handleCloseAlert"
        />
        <base-description :attributes="attributes" :data="taskStatus" />
        <task-status-edit-modal
          :task-status="taskStatus"
          v-model="editModalVisible"
          v-on:updated="handleUpdated"
        />
        <task-status-delete-confirm
          :task-status="taskStatus"
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
