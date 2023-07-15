<script setup>
import { useRequest } from 'src/composes/request.compose';
import { useString } from 'src/composes/resource.compose';
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import BaseTable from 'src/components/base/base-table.vue';
import BaseButton from 'src/components/base/base-button.vue';
import TaskStatusDropdown from 'src/components/modules/task-status/task-status-dropdown.vue';
import TaskCreateModal from 'src/components/modules/task/task-create-modal.vue';
import TaskCreateInline from 'src/components/modules/task/task-create-inline.vue';
import TaskDetailModal from 'src/components/modules/task/task-detail-modal.vue';
import TaskPriorityBadge from 'src/components/modules/task/task-priority-badge.vue';
import TaskListFilter from 'src/components/modules/task/task-list-filter.vue';
import { h, reactive, ref, computed } from 'vue';
import { toDate } from 'src/utils/date';

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
    name: null,
    task_status_id: null,
    task_category_id: null,
    is_due: null,
    due_date_from: null,
    due_date_to: null,
    priority: null,
  },
  include: ['category', 'status'],
});
const filterTaskStatus = ref(null);
const filterTaskCategory = ref(null);

const visibleCreateModal = ref(false);
const detailModal = reactive({
  visible: false,
  taskId: null,
});

const hasMoreData = computed(
  () => data.value.data.length < data.value.meta.total
);

const tableColumns = [
  {
    id: 'name',
    name: getString('task.attributes.name'),
    bold: true,
    render: ({ item }) =>
      h(
        'div',
        { class: 'flex flex-col' },
        {
          default: () => [
            h(
              'div',
              { class: 'flex items-center gap-x-2' },
              {
                default: () => [
                  h(
                    'a',
                    {
                      href: '#',
                      class: 'hover:underline',
                      onClick: () => handleDetail(item),
                    },
                    item.name
                  ),
                  item.priority ? h(TaskPriorityBadge, { task: item }) : null,
                ],
              }
            ),
            h(
              'span',
              {
                class: 'text-xs text-gray-500',
              },
              item.due_date ? toDate(item.due_date) : '-'
            ),
          ],
        }
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
function resetSort() {
  fetchTasksParams.sort = '-created_at';
}
function resetFilter() {
  fetchTasksParams.filter.name = null;
  fetchTasksParams.filter.task_category_id = null;
  fetchTasksParams.filter.task_status_id = null;
  fetchTasksParams.filter.is_due = null;
  fetchTasksParams.filter.due_date_from = null;
  fetchTasksParams.filter.due_date_to = null;
  fetchTasksParams.filter.priority = null;

  filterTaskCategory.value = null;
  filterTaskStatus.value = null;
}
function refresh() {
  resetPage();
  resetSort();
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
  fetchTasksParams.filter.is_due = fetchTasksParams.filter.is_due || null;

  reload();
}
function handleFilterStatus() {
  fetchTasksParams.filter.task_status_id = filterTaskStatus.value?.id ?? null;

  reload();
}
function handleFilterCategory() {
  fetchTasksParams.filter.task_category_id =
    filterTaskCategory.value?.id ?? null;

  reload();
}
function handleSort() {
  reload();
}
function handleCreate() {
  visibleCreateModal.value = true;
}
function handleRefresh() {
  refresh();
}
function handleReload() {
  reload();
}
function handleDetail(item) {
  detailModal.taskId = item.id;
  detailModal.visible = true;
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
          <task-list-filter
            v-model:sort="fetchTasksParams.sort"
            v-model:filter="fetchTasksParams.filter"
            v-model:status="filterTaskStatus"
            v-model:category="filterTaskCategory"
            v-on:sort="handleSort"
            v-on:filter="handleFilter"
            v-on:filter-category="handleFilterCategory"
            v-on:filter-status="handleFilterStatus"
          />
          <base-table
            :columns="tableColumns"
            :data="data.data"
            :loading="loading"
            with-footer
            v-model:sort="fetchTasksParams.sort"
            v-on:change-sort="handleSort"
          >
            <template #[`status`]="{ item }">
              <task-status-dropdown
                :task="item"
                v-model="item.status"
                v-on:updated="handleReload"
              />
            </template>
            <template #footer="{ classes }">
              <tr>
                <td
                  :class="[classes.td, hasMoreData ? '' : 'rounded-b-lg']"
                  colspan="3"
                >
                  <task-create-inline v-on:created="handleRefresh" />
                </td>
              </tr>
              <tr v-if="hasMoreData">
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
      v-model="visibleCreateModal"
      v-on:created="handleRefresh"
    />
    <task-detail-modal
      :task-id="detailModal.taskId"
      v-model="detailModal.visible"
      v-on:updated="handleRefresh"
      v-on:deleted="handleRefresh"
    />
  </div>
</template>
