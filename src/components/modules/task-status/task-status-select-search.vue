<script setup>
import { useRequest } from 'src/composes/request.compose';
import BaseSelectSearch from 'src/components/base/base-select-search.vue';
import { computed } from 'vue';
import { useString } from 'src/composes/resource.compose';

const props = defineProps({
  modelValue: {
    type: null,
    default: null,
  },
});
const emit = defineEmits(['update:modelValue', 'change']);

const { getString } = useString();
const {
  data,
  loading: loadingTaskStatuses,
  request: fetchTaskStatuses,
} = useRequest({
  method: 'get',
  url: '/api/task-statuses',
  notifyOnError: true,
  initData: { data: [] },
});

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

async function loadTaskStatuses() {
  await fetchTaskStatuses();
}
function handleFocus() {
  loadTaskStatuses();
}
function handleChange() {
  emit('change');
}
</script>

<template>
  <base-select-search
    :items="data.data"
    items-width="fit"
    items-align="right"
    size="sm"
    :loading="loadingTaskStatuses"
    :placeholder="getString('task.placeholder.status')"
    :searchable="false"
    v-model="value"
    v-on:focus="handleFocus"
    v-on:change="handleChange"
  />
</template>
