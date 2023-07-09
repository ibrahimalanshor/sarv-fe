<script setup>
import { useRequest } from 'src/composes/request.compose';
import { useString } from 'src/composes/resource.compose';
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import BaseTable from 'src/components/base/base-table.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseButton from 'src/components/base/base-button.vue';
import TaskStatusDropdown from 'src/components/modules/task-status/task-status-dropdown.vue';
import TaskStatusSelectSearch from 'src/components/modules/task-status/task-status-select-search.vue';
import TaskCategorySelectSearch from 'src/components/modules/task-category/task-category-select-search.vue';
import TaskCreateModal from 'src/components/modules/task/task-create-modal.vue';
import TaskCreateInline from 'src/components/modules/task/task-create-inline.vue';
import TaskDetailModal from 'src/components/modules/task/task-detail-modal.vue';
import { h, reactive, ref } from 'vue';

const { getString } = useString();
const { data, loading, request } = useRequest({
  method: 'get',
  url: '/api/tasks',
  notifyOnError: true,
  initLoading: true,
  initData: { data: [], meta: {} },
});

const fetchTasksParams = reactive({
  sort: '-id',
  page: {
    number: 1,
    size: 10,
  },
  filter: {
    name: null,
    task_status_id: null,
    task_category_id: null,
  },
  include: ['category', 'status'],
});
const filterTaskStatus = ref(null);
const filterTaskCategory = ref(null);
const visibleTaskCreateModal = ref(false);
const detailTaskDetailModal = reactive({
  visible: false,
  taskId: null,
});

const tableColumns = [
  {
    id: 'name',
    name: getString('task.attributes.name'),
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
  {
    id: 'category',
    name: getString('task.attributes.category'),
    sortable: false,
    value: (item) => item.category?.name ?? '-',
  },
  {
    id: 'status',
    sortable: false,
    name: getString('task.attributes.status'),
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
  fetchTasksParams.page.size = 10;
}
function resetFilter() {
  fetchTasksParams.filter.name = null;
  fetchTasksParams.filter.task_category_id = null;
  fetchTasksParams.filter.task_status_id = null;

  filterTaskCategory.value = null;
  filterTaskStatus.value = null;
}
function refresh() {
  resetPage();
  resetFilter();
  loadTasks();
}
function reload() {
  resetPage();
  loadTasks();
}

function handleLoadMore() {
  fetchTasksParams.page.size += 10;

  loadTasks();
}
function handleFilter() {
  reload();
}
function handleChangeTaskStatus() {
  fetchTasksParams.filter.task_status_id = filterTaskStatus.value?.id ?? null;

  reload();
}
function handleChangeTaskCategory() {
  fetchTasksParams.filter.task_category_id =
    filterTaskCategory.value?.id ?? null;

  reload();
}
function handleChangeSort() {
  reload();
}
function handleCreate() {
  visibleTaskCreateModal.value = true;
}
function handleRefresh() {
  refresh();
}
function handleDetail(item) {
  detailTaskDetailModal.taskId = item.id;
  detailTaskDetailModal.visible = true;
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
        <div class="space-y-4">
          <div class="flex gap-x-2 justify-end">
            <task-category-select-search
              v-model="filterTaskCategory"
              v-on:change="handleChangeTaskCategory"
            />
            <task-status-select-search
              v-model="filterTaskStatus"
              v-on:change="handleChangeTaskStatus"
            />
            <base-input
              type="text"
              placeholder="actions.search"
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
            with-footer
            v-model:sort="fetchTasksParams.sort"
            v-on:change-sort="handleChangeSort"
          >
            <template #footer="{ classes }">
              <tr>
                <td :class="[classes.td]" colspan="3">
                  <task-create-inline v-on:created="handleRefresh" />
                </td>
              </tr>
              <tr v-if="data.data.length < data.meta.total">
                <td
                  :class="[
                    classes.td,
                    'rounded-b-lg text-center text-gray-500 cursor-pointer',
                  ]"
                  colspan="3"
                  v-on:click="handleLoadMore"
                >
                  {{ getString('actions.load-more') }}
                </td>
              </tr>
            </template>
          </base-table>
        </div>
      </base-container>
    </main>
    <task-create-modal
      v-model="visibleTaskCreateModal"
      v-on:created="handleRefresh"
    />
    <task-detail-modal
      :task-id="detailTaskDetailModal.taskId"
      v-model="detailTaskDetailModal.visible"
      v-on:updated="handleRefresh"
    />
  </div>
</template>
