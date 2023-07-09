<script setup>
import { useRequest } from 'src/composes/request.compose';
import BaseSelectSearch from 'src/components/base/base-select-search.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseSpinner from 'src/components/base/base-spinner.vue';
import { computed } from 'vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { useString } from 'src/composes/resource.compose';

const props = defineProps({
  modelValue: {
    type: null,
    default: null,
  },
  task: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue']);

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
const {
  url: updateTaskUrl,
  loading: loadingUpdateTask,
  request: updateTask,
} = useRequest({
  method: 'patch',
  url: '/api/tasks',
  notifyOnError: true,
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
async function handleChange(value) {
  updateTaskUrl.value = `/api/tasks/${props.task.id}`;

  await updateTask({
    name: props.task.name,
    task_status_id: value.id,
  });
}
</script>

<template>
  <base-select-search
    :items="data.data"
    items-width="fit"
    items-align="right"
    size="sm"
    v-model="value"
    v-on:focus="handleFocus"
    v-on:change="handleChange"
  >
    <template #toggle="{ focus }">
      <base-button
        :text="value?.name ?? getString('task.placeholder.no-status')"
        size="sm"
        :loading="loadingUpdateTask"
        :color="value ? 'indigo' : 'white'"
        v-on:click="focus"
      >
        <template #right>
          <template v-if="!loadingUpdateTask">
            <base-spinner v-if="loadingTaskStatuses" size="xs" />
            <ChevronDownIcon
              v-else
              :class="['-mr-1 h-5 w-5', value ? 'text-white' : 'text-gray-400']"
              aria-hidden="true"
            />
          </template>
        </template>
      </base-button>
    </template>
  </base-select-search>
</template>
