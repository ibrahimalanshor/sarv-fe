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
import TaskChildrenStatusBadge from './task-children-status-badge.vue';
import TaskList from './task-list.vue';
import TaskDeleteConfirm from './task-delete-confirm.vue';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTaskFindOne } from 'src/composes/modules/task/task-find-one.compose';
import { useTaskFindAll } from 'src/composes/modules/task/task-find-all.compose';
import { getString } from 'src/utils/resource.js';

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
  task,
  loading: loadingTask,
  error: errorTask,
  findOneTask,
} = useTaskFindOne();
const {
  data: taskChildren,
  loading: loadingTaskChildren,
  findAllTask,
} = useTaskFindAll();

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
  await findOneTask(props.taskId, {
    include: ['category', 'children_count', 'children_done_count'],
  });
}
async function loadTaskChildren() {
  await findAllTask({
    filter: {
      parent_id: task.value.id,
    },
    page: {
      size: 5,
    },
  });
}

async function handleVisible() {
  await loadTask();

  if (task.value.is_parent) {
    await loadTaskChildren();
  }
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
function handleClose() {
  visible.value = false;
}
function handleReloadTaskChildren() {
  loadTaskChildren();
}
function handleLoadMoreTaskChildren() {
  router.push({ name: 'task.detail', params: { id: task.value.id } });
}
</script>

<template>
  <base-slide-over v-model="visible" v-on:visible="handleVisible">
    <template #title>
      <base-skeleton v-if="loadingTask" class="w-40 h-7" />
      <task-edit-status
        v-else-if="!errorTask"
        :task="task"
        v-on:updated="handleUpdated"
      />
    </template>

    <template #action>
      <div v-if="!errorTask" class="flex items-center gap-x-2">
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
        <base-close v-on:click="handleClose" />
      </div>
    </template>

    <base-skeleton v-if="loadingTask" />
    <template v-else>
      <base-alert
        type="error"
        :text="errorTask"
        :force-visible="!!errorTask"
        :dismissable="false"
      />
      <div v-if="!errorTask" class="space-y-6">
        <task-description
          :task="task"
          :attributes="attributes"
          :base-description-props="{
            cols: 'grid-cols-1',
            contentGaps: 'space-y-1',
            reverseColor: true,
          }"
        />
        <div class="space-y-1">
          <div
            class="text-sm text-gray-500 font-medium leading-6 flex items-center justify-between"
          >
            {{ getString('task.attributes.sub_tasks') }}
            <task-children-status-badge :meta="task.meta" />
          </div>
          <task-list
            v-if="task.is_parent"
            size="sm"
            :parent="false"
            :data="taskChildren.data"
            :meta="taskChildren.meta"
            :loading="loadingTaskChildren"
            :columns="{
              category: false,
              meta: false,
            }"
            :create-values="{
              parent_id: task.id,
            }"
            :with-filter="false"
            :auto-load-more="false"
            v-on:reload="handleReloadTaskChildren"
            v-on:load-more="handleLoadMoreTaskChildren"
          />
        </div>
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
