<script setup>
import BaseConfirm from 'src/components/base/base-confirm.vue';
import { computed } from 'vue';
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  taskCategory: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'deleted']);

const { getString } = useString();
const {
  request: deleteTaskCategory,
  url: deleteTaskCategoryUrl,
  loading: deleteTaskCategoryLoading,
} = useRequest({
  method: 'delete',
  url: '/api/task-categories/:id',
  notifyOnError: true,
});

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

async function handleConfirm() {
  deleteTaskCategoryUrl.value = `/api/task-categories/${props.taskCategory.id}`;

  const [success] = await deleteTaskCategory();

  if (success) {
    visible.value = false;

    emit('deleted');
  }
}
</script>

<template>
  <base-confirm
    :title="getString('task-category.actions.delete')"
    :message="getString('task-category.message.delete')"
    :action="getString('actions.delete')"
    type="danger"
    :loading="deleteTaskCategoryLoading"
    v-model="visible"
    v-on:confirm="handleConfirm"
  />
</template>
