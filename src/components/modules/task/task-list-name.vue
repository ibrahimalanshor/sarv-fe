<script setup>
import { toDate } from 'src/utils/date';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['click']);

function handleClickName() {
  emit('click', props.task);
}
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center gap-x-2">
      <a href="#" class="hover:underline" v-on:click="handleClickName">{{
        task.name
      }}</a>
    </div>
    <div class="flex items-center gap-x-2 text-xs text-gray-500">
      <span v-if="task.due_date" class="text-xs text-gray-500">{{
        toDate(task.due_date)
      }}</span>
      <svg
        v-if="task.due_date && task.meta.children_count !== 0"
        viewBox="0 0 2 2"
        class="h-0.5 w-0.5 fill-current"
      >
        <circle cx="1" cy="1" r="1" />
      </svg>
      <span v-if="task.meta.children_count !== 0"
        >{{ task.meta.children_done_count }}/{{
          task.meta.children_count
        }}
        done</span
      >
    </div>
  </div>
</template>
