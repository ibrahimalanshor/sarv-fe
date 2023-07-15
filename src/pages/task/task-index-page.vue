<script setup>
import { useRequest } from 'src/composes/request.compose';
import { useString } from 'src/composes/resource.compose';
import BaseHeader from 'src/components/base/base-header.vue';
import BaseContainer from 'src/components/base/base-container.vue';
import BaseTable from 'src/components/base/base-table.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseDropdown from 'src/components/base/base-dropdown.vue';
import BaseCheckbox from 'src/components/base/base-checkbox.vue';
import TaskStatusDropdown from 'src/components/modules/task-status/task-status-dropdown.vue';
import TaskStatusSelectSearch from 'src/components/modules/task-status/task-status-select-search.vue';
import TaskCategorySelectSearch from 'src/components/modules/task-category/task-category-select-search.vue';
import TaskCreateModal from 'src/components/modules/task/task-create-modal.vue';
import TaskCreateInline from 'src/components/modules/task/task-create-inline.vue';
import TaskDetailModal from 'src/components/modules/task/task-detail-modal.vue';
import TaskPriorityBadge from 'src/components/modules/task/task-priority-badge.vue';
import { h, reactive, ref, computed } from 'vue';
import { toDate, startOf, endOf } from 'src/utils/date';

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
    is_due: null,
    due_date_from: null,
    due_date_to: null,
  },
  include: ['category', 'status'],
});
const filterTaskStatus = ref(null);
const filterTaskCategory = ref(null);
const filterIsDueToday = ref(false);

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
function resetFilter() {
  fetchTasksParams.filter.name = null;
  fetchTasksParams.filter.task_category_id = null;
  fetchTasksParams.filter.task_status_id = null;
  fetchTasksParams.filter.is_due = null;
  fetchTasksParams.filter.due_date_from = null;
  fetchTasksParams.filter.due_date_to = null;

  filterTaskCategory.value = null;
  filterTaskStatus.value = null;
  filterIsDueToday.value = false;
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
function handleFilterIsDue() {
  fetchTasksParams.filter.is_due = fetchTasksParams.filter.is_due || null;

  reload();
}
function handleFilterIsDueToday() {
  fetchTasksParams.filter.due_date_from = filterIsDueToday.value
    ? startOf(new Date())
    : null;
  fetchTasksParams.filter.due_date_to = filterIsDueToday.value
    ? endOf(new Date())
    : null;

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
          <div class="flex gap-x-2 justify-end">
            <base-dropdown>
              <template #toggle="{ toggle }">
                <base-button
                  text="actions.filter"
                  :classes="{ base: 'h-full' }"
                  text-from-resource
                  v-on:click="toggle"
                />
              </template>

              <template #content="{ classes }">
                <div :class="[classes.item, 'hover:bg-transparent space-y-4']">
                  <base-checkbox
                    text="task.filter.is-due"
                    text-from-resource
                    v-model="fetchTasksParams.filter.is_due"
                    v-on:change="handleFilterIsDue"
                  />
                  <base-checkbox
                    text="task.filter.due-today"
                    text-from-resource
                    v-model="filterIsDueToday"
                    v-on:change="handleFilterIsDueToday"
                  />
                </div>
              </template>
            </base-dropdown>
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
