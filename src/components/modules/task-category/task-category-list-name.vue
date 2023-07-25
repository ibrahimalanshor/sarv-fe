<script setup>
import { useString } from 'src/composes/resource.compose';

const props = defineProps({
  taskCategory: {
    type: Object,
    required: true,
  },
});

const { getString } = useString();
</script>

<template>
  <div class="flex flex-col">
    <router-link
      :to="{ name: 'task-category.detail', params: { id: taskCategory.id } }"
      class="hover:underline"
      >{{ taskCategory.name }}</router-link
    >
    <div class="flex items-center gap-x-2 text-xs text-gray-500">
      <span>{{
        getString('task-category.attributes.task_count', {
          count: taskCategory.meta.tasks_count,
          done: taskCategory.meta.tasks_done_count,
        })
      }}</span>
    </div>
  </div>
</template>
