<script setup>
import { useRequest } from 'src/composes/request.compose';
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import BaseButton from 'src/components/base/base-button.vue';
import TaskList from 'src/components/modules/task/task-list.vue';
import { reactive, ref } from 'vue';

const { data, loading, request } = useRequest({
  method: 'get',
  url: '/api/tasks',
  notifyOnError: true,
  initLoading: true,
  initData: { data: [], meta: {} },
});

const fetchTasksParams = reactive({
  sort: 'created_at',
  page: {
    number: 1,
    size: 10,
  },
  filter: {
    is_active: true,
    name: null,
    status: null,
    task_category_id: null,
    is_due: null,
    due_date_from: null,
    due_date_to: null,
    priority: null,
  },
  include: ['category'],
});
const filterTaskCategory = ref(null);

const visibleCreateModal = ref(false);

async function loadTasks() {
  await request({
    params: fetchTasksParams,
  });
}

function handleCreate() {
  visibleCreateModal.value = true;
}
function handleReload() {
  fetchTasksParams.filter.is_due = fetchTasksParams.filter.is_due || null;
  fetchTasksParams.filter.task_category_id =
    filterTaskCategory.value?.id ?? null;

  loadTasks();
}

loadTasks();
</script>

<template>
  <div>
    <base-header title="pages.task.index" title-from-resource>
      <template #action>
        <base-button
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
          :data="data.data"
          :meta="data.meta"
          :loading="loading"
          :create-values="{
            task_category_id: fetchTasksParams.filter.task_category_id,
          }"
          v-model:filter="fetchTasksParams.filter"
          v-model:sort="fetchTasksParams.sort"
          v-model:page="fetchTasksParams.page"
          v-model:category="filterTaskCategory"
          v-model:visible-create-modal="visibleCreateModal"
          v-on:reload="handleReload"
        />
      </base-container>
    </main>
  </div>
</template>
