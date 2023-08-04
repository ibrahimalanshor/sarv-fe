<script setup>
import { useRequest } from 'src/composes/request.compose';
import BaseSelectSearch from 'src/components/base/base-select-search.vue';
import { computed, reactive } from 'vue';
import { useString } from 'src/composes/resource.compose';

const props = defineProps({
  modelValue: {
    type: null,
    default: null,
  },
  inputProps: {
    type: Object,
    default: () => ({}),
  },
  selectSearchProps: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:modelValue', 'change']);

const { getString } = useString();
const {
  data,
  loading: loadingTaskCategories,
  request: fetchTaskCategories,
} = useRequest({
  method: 'get',
  url: '/api/task-categories',
  notifyOnError: true,
  initData: { data: [], meta: {} },
});

const fetchTaskCategoriesParams = reactive({
  filter: {
    name: null,
  },
  page: {
    size: 10,
  },
});

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

async function loadTaskCategories() {
  await fetchTaskCategories({
    params: fetchTaskCategoriesParams,
  });
}
function handleFocus() {
  fetchTaskCategoriesParams.filter.name = null;
  fetchTaskCategoriesParams.page.size = 10;

  loadTaskCategories();
}
function handleChange() {
  emit('change');
}
function handleSearch(value) {
  fetchTaskCategoriesParams.filter.name = value;
  fetchTaskCategoriesParams.page.size = 10;

  loadTaskCategories();
}
function handleEndScroll() {
  if (fetchTaskCategoriesParams.page.size < data.value.meta.total) {
    fetchTaskCategoriesParams.page.size += 10;

    loadTaskCategories();
  }
}
</script>

<template>
  <base-select-search
    :items="data.data"
    items-width="fit"
    items-align="right"
    size="sm"
    :loading="loadingTaskCategories"
    :placeholder="getString('task.placeholder.category')"
    :input-props="props.inputProps"
    v-bind="props.selectSearchProps"
    v-model="value"
    v-on:focus="handleFocus"
    v-on:change="handleChange"
    v-on:search="handleSearch"
    v-on:end-scroll="handleEndScroll"
  />
</template>
