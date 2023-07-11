<script setup>
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';
import BaseAlert from 'src/components/base/base-alert.vue';
import BaseModal from 'src/components/base/base-modal.vue';
import BaseButton from 'src/components/base/base-button.vue';
import BaseSkeleton from 'src/components/base/base-skeleton.vue';
import BaseDescription from 'src/components/base/base-description.vue';
import { computed, ref } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  taskCategoryId: {
    type: null,
    required: true,
  },
});
const emit = defineEmits([
  'update:modelValue',
  'created',
  'updated',
  'deleted',
]);

const { getString } = useString();
const {
  data: taskCategory,
  request: getTaskCategory,
  url: getTaskCategoryUrl,
  loading: getTaskCategoryLoading,
  error: getTaskCategoryError,
  resetError: resetGetTaskCategoryError,
} = useRequest({
  method: 'get',
  url: '/api/task-categories',
  initData: {},
});

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});
const attributes = computed(() => {
  return [
    {
      id: 'name',
      name: getString('task-category.attributes.name'),
    },
  ];
});

async function loadTaskCategory() {
  getTaskCategoryUrl.value = `/api/task-categories/${props.taskCategoryId}`;

  await getTaskCategory();
}

function handleVisible() {
  resetGetTaskCategoryError();

  loadTaskCategory();
}
function handleCloseAlert() {
  resetGetTaskCategoryError();
}
</script>

<template>
  <base-modal
    :title="getString('task-category.actions.detail')"
    size="lg"
    with-header
    with-footer
    v-model="visible"
    v-on:visible="handleVisible"
  >
    <div class="space-y-4">
      <base-skeleton v-if="getTaskCategoryLoading" />
      <template v-else>
        <base-alert
          :text="getTaskCategoryError"
          type="error"
          :force-visible="!!getTaskCategoryError"
          v-on:close="handleCloseAlert"
        />
        <base-description :attributes="attributes" :data="taskCategory" />
      </template>
    </div>

    <template #footer="{ close }">
      <div class="flex items-center justify-end">
        <base-button
          text="actions.cancel"
          text-from-resource
          v-on:click="close"
        />
      </div>
    </template>
  </base-modal>
</template>
