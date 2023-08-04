<script setup>
import {
  parseStatusColor,
  parseStatusName,
} from 'src/helpers/modules/task.helper';
import BaseBadge from 'src/components/base/base-badge.vue';
import { computed } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
  badgeProps: {
    type: Object,
    default: () => ({}),
  },
});

const color = computed(() => parseStatusColor(props.task.status));
const text = computed(() => parseStatusName(props.task.status));
</script>

<template>
  <base-badge :color="color" :text="text" v-bind="props.badgeProps" />
</template>
