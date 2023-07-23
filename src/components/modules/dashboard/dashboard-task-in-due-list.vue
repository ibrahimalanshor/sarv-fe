<script setup>
import { reactive, inject, ref } from 'vue';
import { useRequest } from 'src/composes/request.compose';
import { useString } from 'src/composes/resource.compose';
import { startOf, endOf } from 'src/utils/date';
import TaskStackedList from 'src/components/modules/task/task-stacked-list.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseCheckbox from 'src/components/base/base-checkbox.vue';

const emitter = inject('emitter');
const { getString } = useString();
const { data, loading, request } = useRequest({
  method: 'get',
  url: '/api/tasks',
  notifyOnError: true,
  initLoading: true,
  initData: { data: [], meta: {} },
});

const fetchTasksParams = reactive({
  sort: '-created_at',
  page: {
    number: 1,
    size: 5,
  },
  filter: {
    is_active: true,
    is_due: true,
  },
  include: ['category'],
});
const filterDueToday = ref(true);

const actions = [
  {
    id: 'mark-as-todo',
    name: getString('dashboard.task.actions.mark-as-todo'),
    value: 'todo',
  },
  {
    id: 'mark-as-in-progress',
    name: getString('dashboard.task.actions.mark-as-in-progress'),
    value: 'in-progress',
  },
  {
    id: 'mark-as-done',
    name: getString('dashboard.task.actions.mark-as-done'),
    value: 'done',
  },
];

async function loadTasks() {
  if (filterDueToday.value) {
    fetchTasksParams.filter.due_date_from = startOf(new Date());
    fetchTasksParams.filter.due_date_to = endOf(new Date());
  } else {
    fetchTasksParams.filter.due_date_from = null;
    fetchTasksParams.filter.due_date_to = null;
  }

  await request({
    params: fetchTasksParams,
  });
}

function handleFilter() {
  loadTasks();
}

emitter.on('task-updated', () => loadTasks());

loadTasks();
</script>

<template>
  <task-stacked-list
    :title="getString('dashboard.task.titles.task-due')"
    empty-text="dashboard.task.messages.task-due-today-empty"
    :loading="loading"
    :data="data.data"
    :actions="actions"
  >
    <template #header-actions>
      <div class="flex items-center gap-x-4">
        <base-checkbox
          text="dashboard.task.filters.only-due-today"
          text-from-resource
          v-model="filterDueToday"
          v-on:change="handleFilter"
        />
        <router-link :to="{ name: 'task.index' }">
          <base-button text="actions.see-more" text-from-resource size="sm" />
        </router-link>
      </div>
    </template>
  </task-stacked-list>
</template>
