<script setup>
import SortDropdown from 'src/components/modules/sort-dropdown.vue';
import BaseDropdown from 'src/components/base/base-dropdown.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseSelect from 'src/components/base/base-select.vue';
import BaseCheckbox from 'src/components/base/base-checkbox.vue';
import BaseInput from 'src/components/base/base-input.vue';
import TaskStatusSelect from './task-status-select.vue';
import TaskCategorySelectSearch from 'src/components/modules/task-category/task-category-select-search.vue';
import { computed } from 'vue';
import { getAvaiablePriorities } from 'src/helpers/modules/task.helper';
import { capitalize } from 'src/utils/string';
import { startOf, endOf } from 'src/utils/date';
import { useString } from 'src/composes/resource.compose';

const props = defineProps({
  sort: {
    type: String,
    default: null,
  },
  filter: {
    type: Object,
    default: () => ({}),
  },
  category: {
    type: Object,
    default: () => ({}),
  },
  filterable: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits([
  'update:sort',
  'update:filter',
  'update:category',
  'sort',
  'filter',
  'filter-category',
  'filter-status',
]);

const { getString } = useString();

const sortColumnOptions = [
  {
    id: 'created_at',
    name: getString('task.attributes.created_at'),
  },
  {
    id: 'updated_at',
    name: getString('task.attributes.updated_at'),
  },
  {
    id: 'due_date',
    name: getString('task.attributes.due_date'),
  },
  {
    id: 'name',
    name: getString('task.attributes.name'),
  },
  {
    id: 'status',
    name: getString('task.attributes.status'),
  },
  {
    id: 'priority',
    name: getString('task.attributes.priority'),
  },
];

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
const filterIsDueToday = computed({
  get() {
    return (
      filterValue.value.due_date_from === startOf(new Date()) &&
      filterValue.value.due_date_to === endOf(new Date())
    );
  },
  set(value) {
    if (value) {
      filterValue.value.due_date_from = startOf(new Date());
      filterValue.value.due_date_to = endOf(new Date());
    } else {
      filterValue.value.due_date_from = null;
      filterValue.value.due_date_to = null;
    }

    emit('filter');
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
const countFilterApplied = computed(() => {
  return (
    filterValue.value.priority +
    filterIsDueToday.value +
    filterValue.value.is_due
  );
});

function handleChange() {
  emit('sort');
}
function handleFilter() {
  emit('filter');
}
function handleFilterCategory() {
  emit('filter-category');
}
function handleChangeStatus() {
  filterValue.value.status = null;

  emit('filter');
}
</script>

<template>
  <div class="flex gap-x-2 justify-end">
    <sort-dropdown
      :columns="sortColumnOptions"
      v-model="sortValue"
      v-on:change="handleChange"
    />
    <base-dropdown width="fit" position="right">
      <template #toggle="{ toggle }">
        <base-button :classes="{ base: 'h-full' }" v-on:click="toggle">
          <span v-if="!countFilterApplied">{{
            getString('actions.filter')
          }}</span>
          <span v-else>{{
            getString('message.filter-applied', { count: countFilterApplied })
          }}</span>
        </base-button>
      </template>

      <template #content="{ classes }">
        <div class="space-y-2">
          <div :class="[classes.item, 'hover:bg-transparent space-y-4']">
            <base-select
              label="task.filter.priority"
              placeholder="task.filter.priority"
              :with-label="true"
              label-from-resource
              fullwidth
              placeholder-from-resource
              :options="
                getAvaiablePriorities().map((item) => ({
                  id: item.value,
                  name: capitalize(item.name),
                }))
              "
              v-model="filterValue.priority"
              v-on:change="handleFilter"
            />
          </div>
          <hr />
          <div :class="[classes.item, 'hover:bg-transparent space-y-4']">
            <base-checkbox
              text="task.filter.is-due"
              text-from-resource
              v-model="filterValue.is_due"
              v-on:change="handleFilter"
            />
            <base-checkbox
              text="task.filter.due-today"
              text-from-resource
              v-model="filterIsDueToday"
            />
          </div>
        </div>
      </template>
    </base-dropdown>
    <task-category-select-search
      v-if="props.filterable.category ?? true"
      v-model="filterTaskCategory"
      v-on:change="handleFilterCategory"
    />
    <base-select
      :options="[
        { id: true, name: 'Active' },
        { id: false, name: 'Not Active' },
      ]"
      :with-label="false"
      :with-placeholder="false"
      v-model="filterValue.is_active"
      v-on:change="handleChangeStatus"
    />
    <task-status-select
      :select-props="{ withLabel: false }"
      :is-active="filterValue.is_active"
      v-model="filterValue.status"
      v-on:change="handleFilter"
    />
    <base-input
      type="text"
      placeholder="actions.search"
      placeholder-from-resource
      debounce
      :with-label="false"
      v-model="filterValue.name"
      v-on:input="handleFilter"
    />
  </div>
</template>
