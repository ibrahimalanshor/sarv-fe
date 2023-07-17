<script setup>
import BaseSelect from 'src/components/base/base-select.vue';
import BaseButton from 'src/components/base/base-button.vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import { computed } from 'vue';
import {
  parseStatusColor,
  parseStatusName,
  getAvaiableStatuses,
} from 'src/helpers/modules/task.helper';

const props = defineProps({
  modelValue: {
    type: String,
    default: null,
  },
  selectProps: {
    type: Object,
    default: () => ({}),
  },
});
const emit = defineEmits(['update:modelValue', 'change']);

const options = [
  {
    id: 'todo',
    name: 'Todo',
  },
  {
    id: 'pending',
    name: 'Pending',
  },
  {
    id: 'in-progress',
    name: 'In Progress',
  },
  {
    id: 'done',
    name: 'Done',
  },
];

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
const style = computed(() => {
  const inputColors = {
    todo: 'bg-gray-50 text-gray-600 ring-gray-500/10',
    'in-progress': 'bg-indigo-50 px-2 py-1 text-indigo-700 ring-indigo-700/10',
    pending: 'bg-yellow-50 px-2 py-1 text-yellow-800 ring-yellow-600/20',
    done: 'bg-green-50 px-2 py-1 text-green-700 ring-green-600/20',
  };

  return {
    input: inputColors[value.value],
  };
});

function handleChange() {
  emit('change');
}
</script>

<template>
  <base-button
    :text="parseStatusName(value)"
    :color="`${parseStatusColor(value)}-soft`"
    v-bind="props.selectProps"
  >
    <template #right>
      <ChevronDownIcon :class="['-mr-1 h-5 w-5']" />
    </template>
  </base-button>
</template>
