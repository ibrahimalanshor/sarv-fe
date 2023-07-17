<script setup>
import { useString } from 'src/composes/resource.compose';
import BaseTable from 'src/components/base/base-table.vue';
import TaskCreateModal from 'src/components/modules/task/task-create-modal.vue';
import TaskCreateInline from 'src/components/modules/task/task-create-inline.vue';
import TaskDetailModal from 'src/components/modules/task/task-detail-modal.vue';
import TaskPriorityBadge from 'src/components/modules/task/task-priority-badge.vue';
import TaskEditStatusSelect from './task-edit-status-select.vue';
import TaskListFilter from 'src/components/modules/task/task-list-filter.vue';
import { h, reactive, ref, computed } from 'vue';
import { toDate } from 'src/utils/date';
import { RouterLink } from 'vue-router';

const props = defineProps({
  sort: {
    type: String,
    default: '-created_at',
  },
  filter: {
    type: Object,
    default: () => ({}),
  },
  page: {
    type: Object,
    default: () => ({}),
  },
  data: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  meta: {
    type: Object,
    default: () => ({}),
  },
  status: {
    type: Object,
    default: null,
  },
  category: {
    type: Object,
    default: null,
  },
  filterable: {
    type: Object,
    default: () => ({}),
  },
  attributes: {
    type: Object,
    default: () => ({}),
  },
  createValues: {
    type: Object,
    default: () => ({}),
  },
  formInputs: {
    type: Object,
    default: () => ({}),
  },
  visibleCreateModal: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits([
  'update:sort',
  'update:filter',
  'update:page',
  'update:status',
  'update:category',
  'update:visibleCreateModal',
  'reload',
  'refresh',
  'load',
]);

const { getString } = useString();

const visibleCreateModal = computed({
  get() {
    return props.visibleCreateModal;
  },
  set(value) {
    emit('update:visibleCreateModal', value);
  },
});
const sortValue = computed({
  get() {
    return props.sort;
  },
  set(value) {
    emit('update:sort', value);
  },
});
const filterValue = computed({
  get() {
    return props.filter;
  },
  set(value) {
    emit('update:filter', value);
  },
});
const pageValue = computed({
  get() {
    return props.page;
  },
  set(value) {
    emit('update:page', value);
  },
});
const filterTaskStatus = computed({
  get() {
    return props.status;
  },
  set(value) {
    emit('update:status', value);
  },
});
const filterTaskCategory = computed({
  get() {
    return props.category;
  },
  set(value) {
    emit('update:category', value);
  },
});

const detailModal = reactive({
  visible: false,
  taskId: null,
});

const hasMoreData = computed(() => props.data.length < props.meta.total);

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
  ...[
    props.attributes.category ?? true
      ? {
          id: 'category',
          name: getString('task.attributes.category'),
          sortable: false,
          render: ({ item }) =>
            item.category
              ? h(
                  RouterLink,
                  {
                    class: 'hover:underline',
                    to: {
                      name: 'task-category.detail',
                      params: { id: item.category.id },
                    },
                  },
                  { default: () => item.category.name }
                )
              : h('span', {}, '-'),
        }
      : {},
  ],
  {
    id: 'status',
    sortable: false,
    name: getString('task.attributes.status'),
  },
];

function resetPage() {
  pageValue.value.number = 1;
  pageValue.value.size = 10;
}
function resetSort() {
  sortValue.value = '-created_at';
}
function resetFilter() {
  filterValue.value.name = null;

  if (props.filterable.category ?? true) {
    filterValue.value.task_category_id = null;
    filterTaskCategory.value = null;
  }

  filterValue.value.task_status_id = null;
  filterValue.value.is_due = null;
  filterValue.value.due_date_from = null;
  filterValue.value.due_date_to = null;
  filterValue.value.priority = null;

  filterTaskStatus.value = null;
}
function refresh() {
  resetPage();
  resetSort();
  resetFilter();

  emit('reload');
}
function reload() {
  resetPage();

  emit('reload');
}

function handleLoadMore() {
  pageValue.value.size += 10;

  emit('reload');
}
function handleFilter() {
  reload();
}
function handleSort() {
  reload();
}
function handleRefresh() {
  refresh();
}
function handleDetail(item) {
  detailModal.taskId = item.id;
  detailModal.visible = true;
}
</script>

<template>
  <div>
    <div class="space-y-4">
      <task-list-filter
        :filterable="props.filterable"
        v-model:sort="sortValue"
        v-model:filter="filterValue"
        v-model:status="filterTaskStatus"
        v-model:category="filterTaskCategory"
        v-on:sort="handleSort"
        v-on:filter="handleFilter"
        v-on:filter-category="handleFilter"
        v-on:filter-status="handleFilter"
      />
      <base-table
        :columns="tableColumns"
        :data="props.data"
        :loading="props.loading"
        with-footer
        v-model:sort="sortValue"
        v-on:change-sort="handleSort"
      >
        <template #[`status`]="{ item }">
          <div class="flex">
            <task-edit-status-select
              :task="item"
              v-model="item.status"
              v-on:updated="handleRefresh"
            />
          </div>
        </template>
        <template #footer="{ classes }">
          <tr>
            <td
              :class="[classes.td, hasMoreData ? '' : 'rounded-b-lg']"
              colspan="3"
            >
              <task-create-inline
                :values="props.createValues"
                v-on:created="handleRefresh"
              />
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
    <task-create-modal
      :values="props.createValues"
      :inputs="props.formInputs"
      v-model="visibleCreateModal"
      v-on:created="handleRefresh"
    />
    <task-detail-modal
      :task-id="detailModal.taskId"
      :form-inputs="props.formInputs"
      v-model="detailModal.visible"
      v-on:updated="handleRefresh"
      v-on:deleted="handleRefresh"
    />
  </div>
</template>
