<script setup>
import { useString } from 'src/composes/resource.compose';
import BaseWidget from 'src/components/base/base-widget.vue';
import { computed } from 'vue';

const props = defineProps({
  meta: {
    type: Object,
    required: true,
  },
});

const { getString } = useString();

const data = computed(() => [
  {
    name: 'tasks_count',
    value: props.meta.tasks_count,
  },
  {
    name: 'tasks_done_count',
    value: props.meta.tasks_done_count,
  },
]);
</script>

<template>
  <dl class="grid grid-cols-1 gap-5 sm:grid-cols-4">
    <base-widget
      v-for="{ name, value } in data"
      :key="name"
      :name="getString(`task-category.meta.${name}`)"
      :value="value"
    />
  </dl>
</template>
