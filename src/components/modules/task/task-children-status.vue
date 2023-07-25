<script setup>
import BaseBadge from 'src/components/base/base-badge.vue';
import { computed } from 'vue';
import { useString } from 'src/composes/resource.compose';

const props = defineProps({
  meta: {
    type: Object,
    required: true,
  },
});

const { getString } = useString();

const color = computed(() => {
  const { children_count, children_done_count } = props.meta;

  if (children_count === children_done_count) {
    return 'green';
  }

  if (children_done_count === 0) {
    return 'yellow';
  }

  return 'indigo';
});
const text = computed(() =>
  getString('task.attributes.sub_task_count', {
    count: props.meta.children_count,
    done: props.meta.children_done_count,
  })
);
</script>
<template>
  <base-badge :color="color" :text="text" />
</template>
