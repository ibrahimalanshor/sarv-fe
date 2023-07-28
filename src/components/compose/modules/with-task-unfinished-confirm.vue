<script setup>
import { computed } from 'vue';
import TaskUnfinishedDoneConfirm from 'src/components/modules/task/task-unfinished-done-confirm.vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: null,
  },
  task: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'updated']);

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

function handleUpdated() {
  emit('updated');
}
</script>

<template>
  <div>
    <slot />
    <task-unfinished-done-confirm
      :task="props.task"
      v-model="visible"
      v-on:updated="handleUpdated"
    />
  </div>
</template>
