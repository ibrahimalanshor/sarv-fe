<script setup>
import { reactive, inject } from 'vue';
import { useRequest } from 'src/composes/request.compose';
import { useString } from 'src/composes/resource.compose';
import { startOf, addDay } from 'src/utils/date';
import TaskStackedList from 'src/components/modules/task/task-stacked-list.vue';

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
    due_date_from: startOf(new Date()),
    due_date_to: startOf(addDay(new Date(), 1)),
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
  await request({
    params: fetchTasksParams,
  });
}

emitter.on('task-updated', () => loadTasks());

loadTasks();
</script>

<template>
  <task-stacked-list
    :title="getString('dashboard.task.titles.task-due-today')"
    empty-text="dashboard.task.messages.task-due-today-empty"
    :loading="loading"
    :data="data.data"
    :actions="actions"
  />
</template>
