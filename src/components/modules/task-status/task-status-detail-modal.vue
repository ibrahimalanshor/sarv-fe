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
  taskStatusId: {
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
  data: taskStatus,
  request: getTaskStatus,
  url: getTaskStatusUrl,
  loading: getTaskStatusLoading,
  error: getTaskStatusError,
  resetError: resetGetTaskStatusError,
} = useRequest({
  method: 'get',
  url: '/api/task-statuses',
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
      name: getString('task-status.attributes.name'),
    },
  ];
});

async function loadTaskStatus() {
  getTaskStatusUrl.value = `/api/task-statuses/${props.taskStatusId}`;

  await getTaskStatus();
}

function handleVisible() {
  resetGetTaskStatusError();

  loadTaskStatus();
}
function handleCloseAlert() {
  resetGetTaskStatusError();
}
</script>

<template>
  <base-modal
    :title="getString('task-status.actions.detail')"
    size="lg"
    with-header
    with-footer
    v-model="visible"
    v-on:visible="handleVisible"
  >
    <div class="space-y-4">
      <base-skeleton v-if="getTaskStatusLoading" />
      <template v-else>
        <base-alert
          :text="getTaskStatusError"
          type="error"
          :force-visible="!!getTaskStatusError"
          v-on:close="handleCloseAlert"
        />
        <base-description :attributes="attributes" :data="taskStatus" />
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
