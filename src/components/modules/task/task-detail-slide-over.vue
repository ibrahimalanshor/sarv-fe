<script setup>
import {
  EllipsisHorizontalIcon,
  ArrowTopRightOnSquareIcon,
} from '@heroicons/vue/20/solid';
import BaseAlert from 'src/components/base/base-alert.vue';
import BaseSlideOver from 'src/components/base/base-slide-over.vue';
import BaseSkeleton from 'src/components/base/base-skeleton.vue';
import BaseClose from 'src/components/base/base-close.vue';
import BaseDropdown from 'src/components/base/base-dropdown.vue';
import BaseActionButton from 'src/components/base/base-action-button.vue';
import TaskDescription from './task-description.vue';
import TaskEditStatus from './task-edit-status.vue';
import TaskEditModal from './task-edit-modal.vue';
import TaskDeleteConfirm from './task-delete-confirm.vue';
import { computed, ref } from 'vue';
import { useRequest } from 'src/composes/request.compose';
import { getString } from 'src/utils/resource.js';
import { useRouter } from 'vue-router';

const props = defineProps({
  taskId: {
    type: null,
    required: true,
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  editFormInputs: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:modelValue', 'deleted', 'updated']);

const router = useRouter();
const {
  data: task,
  request: getTask,
  url: getTaskUrl,
  loading: getTaskLoading,
  error: getTaskError,
} = useRequest({
  method: 'get',
  url: '/api/tasks',
  initData: {
    meta: {},
  },
});

const errorVisible = ref(false);
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
  return task.value.is_parent
    ? {
        children_count: false,
        status: false,
      }
    : {
        category: false,
        due_date: false,
        description: false,
        status: false,
        priority: false,
        children_count: false,
      };
});

async function loadTask() {
  getTaskUrl.value = `/api/tasks/${props.taskId}`;

  const [success] = await getTask({
    params: {
      include: ['category', 'children_count', 'children_done_count'],
    },
  });

  if (!success) {
    errorVisible.value = true;
  }
}
function hideError() {
  errorVisible.value = false;
}

function handleVisible() {
  hideError();
  loadTask();
}
function handleAction(action) {
  if (action.id === 'delete') {
    deleteConfirmVisible.value = true;
  } else if (action.id === 'edit') {
    editModalVisible.value = true;
  }
}
function handleUpdated() {
  loadTask();

  emit('updated');
}
function handleDeleted() {
  visible.value = false;

  emit('deleted');
}
function handleDetail() {
  router.push({ name: 'task.detail', params: { id: task.value.id } });
}
</script>

<template>
  <base-slide-over v-model="visible" v-on:visible="handleVisible">
    <template #title>
      <base-skeleton v-if="getTaskLoading" class="w-40 h-7" />
      <task-edit-status
        v-else-if="!getTaskError"
        :task="task"
        v-on:updated="handleUpdated"
      />
    </template>

    <template #action>
      <div v-if="!getTaskError" class="flex items-center gap-x-2">
        <base-action-button v-on:click="handleDetail">
          <arrow-top-right-on-square-icon class="w-5 h-5" />
        </base-action-button>
        <base-dropdown
          :classes="{
            wrapper: 'h-full',
            toggle: 'flex items-center',
          }"
          :items="[
            { id: 'edit', name: getString('actions.edit') },
            { id: 'delete', name: getString('actions.delete') },
          ]"
          size="sm"
          custom-width="w-fit"
          position="right"
          :text-wrap="false"
          v-on:click-item="(action) => handleAction(action)"
        >
          <template #toggle="{ toggle }">
            <base-action-button v-on:click="toggle">
              <ellipsis-horizontal-icon class="w-5 h-5" />
            </base-action-button>
          </template>
        </base-dropdown>
        <base-close />
      </div>
    </template>

    <base-skeleton v-if="getTaskLoading" />
    <template v-else>
      <base-alert
        type="error"
        :text="getTaskError"
        :force-visible="errorVisible"
        :dismissable="false"
      />
      <div v-if="!getTaskError" class="space-y-6">
        <task-description
          :task="task"
          :attributes="attributes"
          :base-description-props="{
            cols: 'grid-cols-1',
            contentGaps: 'space-y-1',
            reverseColor: true,
          }"
        />
      </div>
      <task-edit-modal
        :task="task"
        :inputs="props.editFormInputs"
        v-model="editModalVisible"
        v-on:updated="handleUpdated"
      />
      <task-delete-confirm
        :task="task"
        v-model="deleteConfirmVisible"
        v-on:deleted="handleDeleted"
      />
    </template>
  </base-slide-over>
</template>
