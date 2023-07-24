<script setup>
import BaseButton from 'src/components/base/base-button.vue';
import BaseDropdown from 'src/components/base/base-dropdown.vue';
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

async function handleClickItem(item) {
  value.value = item.value;

  emit('change', item.value);
}
</script>

<template>
  <base-dropdown
    position="left"
    width="fit"
    size="sm"
    :text-wrap="false"
    :items="getAvaiableStatuses()"
    v-on:click-item="handleClickItem"
  >
    <template #toggle="{ toggle }">
      <base-button
        :text="parseStatusName(value)"
        :color="`${parseStatusColor(value)}-soft`"
        size="sm"
        v-on:click="toggle"
      >
        <template #right>
          <ChevronDownIcon :class="['-mr-1 h-5 w-5']" />
        </template>
      </base-button>
    </template>
  </base-dropdown>
</template>
