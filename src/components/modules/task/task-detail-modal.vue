<script setup>
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';
import BaseAlert from 'src/components/base/base-alert.vue';
import BaseModal from 'src/components/base/base-modal.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseSkeleton from 'src/components/base/base-skeleton.vue';
import BaseTitle from 'src/components/base/base-title.vue';
import { computed, ref } from 'vue';
import TaskEditModal from './task-edit-modal.vue';
import TaskDeleteConfirm from './task-delete-confirm.vue';
import TaskDescription from './task-description.vue';
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
import { useRouter } from 'vue-router';

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

const router = useRouter();
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

async function loadTask() {
  getTaskUrl.value = `/api/tasks/${props.taskId}`;

  await getTask({
    params: {
      include: ['category', 'children_count', 'children_done_count'],
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
function handleDetail() {
  router.push({ name: 'task.detail', params: { id: task.value.id } });
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
    size="xl"
    with-header
    with-footer
    v-model="visible"
    v-on:visible="handleVisible"
  >
    <template #title>
      <div class="flex items-center gap-x-4">
        <base-title :level="6" semibold>{{
          getString('task.actions.detail')
        }}</base-title>
        <base-button v-on:click="handleDetail">
          <ArrowTopRightOnSquareIcon class="w-5 h-5" />
        </base-button>
      </div>
    </template>

    <div class="space-y-4">
      <base-skeleton v-if="getTaskLoading" />
      <template v-else>
        <base-alert
          :text="getTaskError"
          type="error"
          :force-visible="!!getTaskError"
          v-on:close="handleCloseAlert"
        />
        <task-description
          :task="task"
          v-model:status="task.status"
          v-on:updated="hanldeUpdatedStatus"
        />
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
