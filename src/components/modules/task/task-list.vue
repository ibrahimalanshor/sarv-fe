<script setup>
import { useString } from 'src/composes/resource.compose';
import BaseTable from 'src/components/base/base-table.vue';
import TaskCreateModal from 'src/components/modules/task/task-create-modal.vue';
import TaskCreateInline from 'src/components/modules/task/task-create-inline.vue';
import TaskDetailSlideOver from './task-detail-slide-over.vue';
import TaskEditStatus from './task-edit-status.vue';
import TaskListFilter from 'src/components/modules/task/task-list-filter.vue';
import TaskListName from './task-list-name.vue';
import { h, reactive, ref, computed } from 'vue';
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
  category: {
    type: Object,
    default: null,
  },
  filterables: {
    type: Object,
    default: () => ({}),
  },
  columns: {
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
  filterJustifyEnd: {
    type: Boolean,
    default: true,
  },
  withFilter: {
    type: Boolean,
    default: true,
  },
  withCreateInline: {
    type: Boolean,
    default: true,
  },
  parent: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    default: 'md',
  },
  autoLoadMore: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits([
  'update:sort',
  'update:filter',
  'update:page',
  'update:category',
  'update:visibleCreateModal',
  'reload',
  'refresh',
  'load',
  'load-more',
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
const formInputs = computed(() => {
  return {
    ...(props.parent
      ? {}
      : {
          category: false,
          priority: false,
          due_date: false,
          description: false,
        }),
    ...props.formInputs,
  };
});
const tableSize = computed(() => props.size);
const editStatusButtonSize = computed(() => {
  const sizes = {
    sm: 'xs',
    md: 'sm',
  };

  return sizes[props.size];
});

const tableColumns = [
  {
    id: 'name',
    name: getString('task.attributes.name'),
    bold: true,
    headerClass: 'max-w-[50%]',
    render: ({ item }) => {
      if (props.columns.meta ?? true) {
        return h(TaskListName, { task: item, onClick: handleDetail });
      }

      return h(
        'span',
        {
          class: 'cursor-pointer hover:underline',
          onClick: () => handleDetail(item),
        },
        item.name
      );
    },
  },
  ...(props.columns.category ?? true
    ? [
        {
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
        },
      ]
    : []),
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
function resetFilter() {
  filterValue.value.name = null;
}
function refresh() {
  resetPage();
  resetFilter();

  emit('reload');
}
function reload() {
  resetPage();

  emit('reload');
}

function handleLoadMore() {
  if (props.autoLoadMore) {
    pageValue.value.size += 10;

    emit('reload');
  } else {
    emit('load-more');
  }
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
        v-if="props.withFilter"
        :filterable="props.filterables"
        :end="props.filterJustifyEnd"
        v-model:sort="sortValue"
        v-model:filter="filterValue"
        v-model:category="filterTaskCategory"
        v-on:sort="handleSort"
        v-on:filter="handleFilter"
        v-on:filter-category="handleFilter"
      />
      <base-table
        :size="tableSize"
        :columns="tableColumns"
        :data="props.data"
        :loading="props.loading"
        with-footer
        v-model:sort="sortValue"
        v-on:change-sort="handleSort"
      >
        <template #[`status`]="{ item }">
          <div class="flex">
            <task-edit-status
              :button-size="editStatusButtonSize"
              :task="item"
              v-model="item.status"
              v-on:updated="handleRefresh"
            />
          </div>
        </template>
        <template #footer="{ classes }">
          <tr v-if="props.withCreateInline">
            <td
              :class="[classes.td, hasMoreData ? '' : 'rounded-b-lg']"
              colspan="3"
            >
              <task-create-inline
                :input-size="props.size"
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
    <task-detail-slide-over
      :task-id="detailModal.taskId"
      :edit-form-inputs="formInputs"
      v-model="detailModal.visible"
      v-on:updated="handleRefresh"
      v-on:deleted="handleRefresh"
    />
  </div>
</template>
