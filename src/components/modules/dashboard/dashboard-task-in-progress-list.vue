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
    empty-text="task-in-progress-empty"
    :loading="loading"
    :data="data.data"
    v-on:reload="handleReload"
  />
</template>
