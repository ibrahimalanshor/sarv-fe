<script setup>
import BaseSelect from 'src/components/base/base-select.vue';
import { getAvaiableStatuses } from 'src/helpers/modules/task.helper';
import { computed } from 'vue';

const props = defineProps({
  selectProps: {
    type: Object,
    default: () => ({}),
  },
  modelValue: {
    type: String,
    default: null,
  },
});
const emit = defineEmits(['update:modelValue', 'change']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

function handleChange() {
  emit('change');
}
</script>

<template>
  <base-select
    placeholder="task.attributes.status"
    :options="
      getAvaiableStatuses().map((item) => ({
        id: item.value,
        name: item.name,
      }))
    "
    placeholder-from-resource
    v-bind="props.selectProps"
    v-model="value"
    v-on:change="handleChange"
  />
</template>
