<script setup>
import { useRequest } from 'src/composes/request.compose';
import { useString } from 'src/composes/resource.compose';
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import BaseTable from 'src/components/base/base-table.vue';
import TaskStatusDropdown from 'src/components/modules/task-status/task-status-dropdown.vue';
import { h, reactive } from 'vue';

const { getString } = useString();
const { data, loading, request } = useRequest({
  method: 'get',
  url: '/api/tasks',
  notifyOnError: true,
  initLoading: true,
  initData: { data: [] },
});

const fetchTasksParams = reactive({
  include: ['category', 'status'],
});
const tableColumns = [
  {
    id: 'name',
    name: getString('task.columns.name'),
    bold: true,
  },
  {
    id: 'category',
    name: getString('task.columns.category'),
    value: (item) => item.category.name,
  },
  {
    id: 'status',
    name: getString('task.columns.status'),
    value: (item) => (item.status ? item.status.name : 'No Status'),
    render: ({ item }) =>
      h(TaskStatusDropdown, {
        task: item,
        modelValue: item.status,
        'onUpdate:modelValue': (value) => (item.status = value),
      }),
  },
];

async function fetchTasks() {
  await request({ params: fetchTasksParams });
}

fetchTasks();
</script>

<template>
  <div>
    <base-header title="pages.task.index" title-from-resource></base-header>
    <main>
      <base-container>
        <base-table
          :columns="tableColumns"
          :data="data.data"
          :loading="loading"
        />
      </base-container>
    </main>
  </div>
</template>
