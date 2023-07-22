<script setup>
import { reactive } from 'vue';
import { useRequest } from 'src/composes/request.compose';
import { useString } from 'src/composes/resource.compose';
import TaskStackedList from 'src/components/modules/task/task-stacked-list.vue';

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
    size: 10,
  },
  filter: {
    status: 'in-progress',
  },
  include: ['category'],
});

const actions = [
  {
    id: 'mark-as-todo',
    name: getString('dashboard.task.actions.mark-as-todo'),
    value: 'todo',
  },
  {
    id: 'mark-as-done',
    name: getString('dashboard.task.actions.mark-as-done'),
    value: 'done',
  },
];

async function loadTasks() {
  await request({
    params: fetchTasksParams,
  });
}

function handleReload() {
  loadTasks();
}

loadTasks();
</script>

<template>
  <task-stacked-list
    :title="getString('dashboard.task.titles.task-in-progress')"
    empty-text="dashboard.task.messages.task-in-progress-empty"
    :loading="loading"
    :data="data.data"
    :actions="actions"
    v-on:reload="handleReload"
  />
</template>
