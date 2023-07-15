<script setup>
import BaseBadge from 'src/components/base/base-badge.vue';
import { computed } from 'vue';
import { parsePriorityColor } from 'src/helpers/modules/task.helper';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const color = computed(() => parsePriorityColor(props.task.priority));
const text = computed(() => props.task.priority);
</script>

<template>
  <base-badge :color="color" :text="text" />
</template>
