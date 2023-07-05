<script setup>
import { useRequest } from 'src/composes/request.compose';
import { useString } from 'src/composes/resource.compose';
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import BaseTable from 'src/components/base/base-table.vue';
import BaseInput from 'src/components/base/base-input.vue';
import TaskStatusDropdown from 'src/components/modules/task-status/task-status-dropdown.vue';
import TaskStatusSelectSearch from 'src/components/modules/task-status/task-status-select-search.vue';
import { h, reactive, ref } from 'vue';

const { getString } = useString();
const { data, loading, request } = useRequest({
  method: 'get',
  url: '/api/tasks',
  notifyOnError: true,
  initLoading: true,
  initData: { data: [] },
});

const fetchTasksParams = reactive({
  page: {
    number: 1,
    size: 10,
  },
  filter: {
    name: null,
    task_status_id: null,
  },
  include: ['category', 'status'],
});
const filterTaskStatus = ref(null);

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

async function loadTasks() {
  await request({
    params: fetchTasksParams,
  });
}
function resetPage() {
  fetchTasksParams.page.number = 1;
}

function handleChangePage() {
  loadTasks();
}
function handleFilter() {
  resetPage();

  loadTasks();
}
function handleChangeTaskStatus() {
  fetchTasksParams.filter.task_status_id = filterTaskStatus.value?.id ?? null;

  resetPage();
  loadTasks();
}

loadTasks();
</script>

<template>
  <div>
    <base-header title="pages.task.index" title-from-resource></base-header>
    <main>
      <base-container>
        <div class="space-y-4">
          <div class="flex gap-x-2 justify-end">
            <task-status-select-search
              v-model="filterTaskStatus"
              v-on:change="handleChangeTaskStatus"
            />
            <base-input
              type="text"
              placeholder="message.search"
              placeholder-from-resource
              debounce
              :with-label="false"
              v-model="fetchTasksParams.filter.name"
              v-on:input="handleFilter"
            />
          </div>
          <base-table
            :columns="tableColumns"
            :data="data.data"
            :loading="loading"
            :meta="data.meta"
            with-pagination
            v-model:page="fetchTasksParams.page.number"
            v-on:change-page="handleChangePage"
          />
        </div>
      </base-container>
    </main>
  </div>
</template>
