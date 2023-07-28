<script setup>
import BaseButton from 'src/components/base/base-button.vue';
import BaseDropdown from 'src/components/base/base-dropdown.vue';
import { ChevronDownIcon } from '@heroicons/vue/20/solid';
import {
  parseStatusColor,
  parseStatusName,
  getAvaiableStatuses,
} from 'src/helpers/modules/task.helper';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'change']);

async function handleClickItem(item) {
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
        :text="parseStatusName(props.task.status)"
        :color="`${parseStatusColor(props.task.status)}-soft`"
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
