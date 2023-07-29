<script setup>
import { useRequest } from 'src/composes/request.compose';
import { ArrowTopRightOnSquareIcon } from '@heroicons/vue/24/outline';
import BaseHeader from 'src/components/base/base-header.vue';
import BaseTitle from 'src/components/base/base-title.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseSkeleton from 'src/components/base/base-skeleton.vue';
import TaskList from 'src/components/modules/task/task-list.vue';
import TaskCategoryDetailModal from 'src/components/modules/task-category/task-category-detail-modal.vue';
import TaskCategoryDetailMeta from 'src/components/modules/task-category/task-category-detail-meta.vue';
import { reactive, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useTitle } from 'src/composes/title.compose';

const route = useRoute();
const router = useRouter();
const { setTitle } = useTitle();
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
  initLoading: true,
  initData: {
    meta: {
      tasks_count: 0,
      tasks_done_count: 0,
    },
  },
});

const fetchTasksParams = reactive({
  sort: 'created_at',
  page: {
    number: 1,
    size: 10,
  },
  filter: {
    name: null,
    status: null,
    task_category_id: null,
    is_due: null,
    due_date_from: null,
    due_date_to: null,
    priority: null,
    is_parent: true,
    statuses: ['todo', 'in-progress'],
  },
  include: ['category', 'children_count', 'children_done_count'],
});
const visibleTaskCreateModal = ref(false);
const visibleDetailModal = ref(false);

async function loadTaskCategory() {
  fetchTaskCategoryUrl.value = `/api/task-categories/${route.params.id}`;

  const [success] = await fetchTaskCategory({
    params: {
      include: ['tasks_count', 'tasks_done_count'],
    },
  });

  if (!success) {
    router.push({ name: '404' });
  }

  fetchTasksParams.filter.task_category_id = taskCategory.value.id;

  setTitle(taskCategory.value.name);
}
async function loadTasks() {
  await fetchTasks({
    params: {
      ...fetchTasksParams,
      sort: fetchTasksParams.sort ?? 'primary',
    },
  });
}

function handleCreateTask() {
  visibleTaskCreateModal.value = true;
}
function handleReloadTasks() {
  fetchTasksParams.filter.is_due = fetchTasksParams.filter.is_due || null;

  loadTasks();
}
function handleReloadTaskCategory() {
  loadTaskCategory();
}
function handleDeletedTaskCategory() {
  router.push({ name: 'task-category.index' });
}
function handleDetail() {
  visibleDetailModal.value = true;
}

async function init() {
  await loadTaskCategory();
  await loadTasks();
}

init();
</script>

<template>
  <div>
    <base-header :title-loading="fetchTaskCategoryLoading">
      <template #title>
        <base-skeleton class="w-1/4 !h-10" v-if="fetchTaskCategoryLoading" />
        <template v-else>
          <div class="flex items-center gap-x-4">
            <base-title :level="3">{{ taskCategory.name }}</base-title>
            <base-button v-on:click="handleDetail">
              <ArrowTopRightOnSquareIcon class="w-5 h-5" />
            </base-button>
          </div>
        </template>
      </template>
      <template #action>
        <base-button
          v-if="!fetchTaskCategoryLoading"
          text="task.actions.create"
          color="indigo"
          text-from-resource
          v-on:click="handleCreateTask"
        />
      </template>
    </base-header>
    <main>
      <base-container>
        <div class="space-y-6">
          <task-category-detail-meta :meta="taskCategory.meta" />
          <hr class="border-gray-200" />
          <task-list
            :data="tasks.data"
            :meta="tasks.meta"
            :loading="fetchTasksLoading"
            :filterable="{ category: false }"
            :columns="{ category: false }"
            :create-values="{ task_category_id: taskCategory.id }"
            :form-inputs="{ category: false }"
            v-model:filter="fetchTasksParams.filter"
            v-model:sort="fetchTasksParams.sort"
            v-model:page="fetchTasksParams.page"
            v-model:visible-create-modal="visibleTaskCreateModal"
            v-on:reload="handleReloadTasks"
          />
        </div>
      </base-container>
    </main>

    <task-category-detail-modal
      :task-category-id="taskCategory.id"
      v-model="visibleDetailModal"
      v-on:updated="handleReloadTaskCategory"
      v-on:deleted="handleDeletedTaskCategory"
    />
  </div>
</template>
