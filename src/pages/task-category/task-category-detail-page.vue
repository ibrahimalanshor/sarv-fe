<script setup>
import { useRequest } from 'src/composes/request.compose';
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import BaseButton from 'src/components/base/base-button.vue';
import TaskList from 'src/components/modules/task/task-list.vue';
import { reactive, ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const {
  data: tasks,
  loading: fetchTasksLoading,
  request: fetchTasks,
} = useRequest({
  method: 'get',
  url: '/api/tasks',
  notifyOnError: true,
  initLoading: true,
  initData: { data: [], meta: {} },
});
const {
  data: taskCategory,
  loading: fetchTaskCategoryLoading,
  request: fetchTaskCategory,
  url: fetchTaskCategoryUrl,
} = useRequest({
  method: 'get',
  url: '/api/task-categories',
  notifyOnError: true,
  initLoading: true,
  initData: {},
});

const fetchTasksParams = reactive({
  sort: '-created_at',
  page: {
    number: 1,
    size: 10,
  },
  filter: {
    name: null,
    task_status_id: null,
    task_category_id: null,
    is_due: null,
    due_date_from: null,
    due_date_to: null,
    priority: null,
  },
  include: ['category', 'status'],
});
const filterTaskStatus = ref(null);
const filterTaskCategory = ref(null);

const visibleCreateModal = ref(false);

async function loadTaskCategory() {
  fetchTaskCategoryUrl.value = `/api/task-categories/${route.params.id}`;

  const [success] = await fetchTaskCategory();

  if (success) {
    fetchTasksParams.filter.task_category_id = taskCategory.value.id;
    filterTaskCategory.value = taskCategory.value;
  }
}
async function loadTasks() {
  await fetchTasks({
    params: fetchTasksParams,
  });
}

function handleCreate() {
  visibleCreateModal.value = true;
}
function handleReload() {
  fetchTasksParams.filter.is_due = fetchTasksParams.filter.is_due || null;
  fetchTasksParams.filter.task_status_id = filterTaskStatus.value?.id ?? null;
  fetchTasksParams.filter.task_category_id =
    filterTaskCategory.value?.id ?? null;

  loadTasks();
}

async function init() {
  await loadTaskCategory();
  await loadTasks();
}

init();
</script>

<template>
  <div>
    <base-header
      :title="taskCategory.name"
      :title-loading="fetchTaskCategoryLoading"
    >
      <template #action>
        <base-button
          v-if="!fetchTaskCategoryLoading"
          text="task.actions.create"
          color="indigo"
          text-from-resource
          v-on:click="handleCreate"
        />
      </template>
    </base-header>
    <main>
      <base-container>
        <task-list
          :data="tasks.data"
          :meta="tasks.meta"
          :loading="fetchTasksLoading"
          :filterable="{ category: false }"
          :attributes="{ category: false }"
          v-model:filter="fetchTasksParams.filter"
          v-model:sort="fetchTasksParams.sort"
          v-model:page="fetchTasksParams.page"
          v-model:category="filterTaskCategory"
          v-model:status="filterTaskStatus"
          v-on:reload="handleReload"
        />
      </base-container>
    </main>
  </div>
</template>
