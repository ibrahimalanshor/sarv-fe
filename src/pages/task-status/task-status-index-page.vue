<script setup>
import { useRequest } from 'src/composes/request.compose';
import { useString } from 'src/composes/resource.compose';
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import BaseTable from 'src/components/base/base-table.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseButton from 'src/components/base/base-button.vue';
import TaskStatusCreateModal from 'src/components/modules/task-status/task-status-create-modal.vue';
import TaskStatusDetailModal from 'src/components/modules/task-status/task-status-detail-modal.vue';
import { h, reactive, ref } from 'vue';

const { getString } = useString();
const { data, loading, request } = useRequest({
  method: 'get',
  url: '/api/task-statuses',
  notifyOnError: true,
  initLoading: true,
  initData: { data: [], meta: {} },
});

const fetchTasksStatusParams = reactive({
  sort: '-id',
  page: {
    number: 1,
    size: 5,
  },
  filter: {
    name: null,
  },
});
const visibleCreateModal = ref(false);
const detailModal = reactive({
  visible: false,
  taskStatusId: null,
});

const tableColumns = [
  {
    id: 'name',
    name: getString('task-status.attributes.name'),
    bold: true,
    render: ({ item }) =>
      h(
        'a',
        {
          href: '#',
          class: 'hover:underline',
          onClick: () => handleDetail(item),
        },
        item.name
      ),
  },
];

async function loadTaskStatuses() {
  await request({
    params: fetchTasksStatusParams,
  });
}
function resetPage() {
  fetchTasksStatusParams.page.number = 1;
  fetchTasksStatusParams.page.size = 5;
}
function resetFilter() {
  fetchTasksStatusParams.filter.name = null;
}
function refresh() {
  resetPage();
  resetFilter();
  loadTaskStatuses();
}
function reload() {
  resetPage();
  loadTaskStatuses();
}

function handleFilter() {
  reload();
}
function handleChangeSort() {
  reload();
}
function handleChangePage() {
  loadTaskStatuses();
}
function handleCreate() {
  visibleCreateModal.value = true;
}
function handleRefresh() {
  refresh();
}
function handleDetail(item) {
  detailModal.taskStatusId = item.id;
  detailModal.visible = true;
}

loadTaskStatuses();
</script>

<template>
  <div>
    <base-header title="pages.task-status.index" title-from-resource>
      <template #action>
        <base-button
          text="task-status.actions.create"
          color="indigo"
          text-from-resource
          v-on:click="handleCreate"
        />
      </template>
    </base-header>
    <main>
      <base-container>
        <div class="space-y-4">
          <div class="flex gap-x-2 justify-end">
            <base-input
              type="text"
              placeholder="actions.search"
              placeholder-from-resource
              debounce
              :with-label="false"
              v-model="fetchTasksStatusParams.filter.name"
              v-on:input="handleFilter"
            />
          </div>
          <base-table
            :columns="tableColumns"
            :data="data.data"
            :loading="loading"
            :meta="data.meta"
            with-pagination
            with-footer
            v-model:sort="fetchTasksStatusParams.sort"
            v-model:page="fetchTasksStatusParams.page.number"
            v-on:change-sort="handleChangeSort"
            v-on:change-page="handleChangePage"
          />
        </div>
      </base-container>
    </main>
    <task-status-create-modal
      v-model="visibleCreateModal"
      v-on:created="handleRefresh"
    />
    <task-status-detail-modal
      :task-status-id="detailModal.taskStatusId"
      v-model="detailModal.visible"
      v-on:updated="handleRefresh"
      v-on:deleted="handleRefresh"
    />
  </div>
</template>
