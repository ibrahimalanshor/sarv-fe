<script setup>
import { useString } from 'src/composes/resource.compose';
import { useRequest } from 'src/composes/request.compose';
import BaseAlert from 'src/components/base/base-alert.vue';
import BaseModal from 'src/components/base/base-modal.vue';
import BaseInput from 'src/components/base/base-input.vue';
import BaseSelect from 'src/components/base/base-select.vue';
import BaseButton from 'src/components/base/base-button.vue';
import { computed, reactive, ref } from 'vue';
import { getAvaiableStatusColors } from 'src/helpers/modules/task-status.helper';
import { capitalize } from 'src/utils/string';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  taskStatus: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(['update:modelValue', 'updated']);

const { getString } = useString();
const {
  request: updateTaskStatus,
  loading: updateTaskStatusLoading,
  validation: updateTaskStatusValidation,
  error: updateTaskStatusError,
  resetError: resetUpdateTaskStatusError,
  resetValidation: resetUpdateTaskStatusValidation,
  url: updateTaskStatusUrl,
} = useRequest({
  method: 'patch',
  url: '/api/task-statuses/:id',
});

const form = reactive({
  name: props.taskStatus.name,
  color: props.taskStatus.color,
});

const visible = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

async function handleSubmit() {
  updateTaskStatusUrl.value = `/api/task-statuses/${props.taskStatus.id}`;

  const [success] = await updateTaskStatus(form);

  if (success) {
    visible.value = false;

    emit('updated');
  }
}
function handleCloseAlert() {
  resetUpdateTaskStatusError();
}
function handleVisible() {
  form.name = props.taskStatus.name;
  form.color = props.taskStatus.color;

  resetUpdateTaskStatusValidation();
  resetUpdateTaskStatusError();
}
</script>

<template>
  <form v-on:submit.prevent="handleSubmit">
    <base-modal
      :title="getString('task-status.actions.edit')"
      with-header
      with-footer
      v-model="visible"
      v-on:visible="handleVisible"
    >
      <div class="space-y-4">
        <base-alert
          :text="updateTaskStatusError"
          type="error"
          :force-visible="!!updateTaskStatusError"
          v-on:close="handleCloseAlert"
        />

        <base-input
          type="text"
          label="task-status.label.name"
          placeholder="task-status.placeholder.name"
          :color="updateTaskStatusValidation.name ? 'red' : 'gray'"
          :message="updateTaskStatusValidation.name"
          fullwidth
          with-label
          label-from-resource
          placeholder-from-resource
          v-model="form.name"
        />

        <base-select
          label="task-status.label.color"
          placeholder="task-status.placeholder.color"
          :color="updateTaskStatusValidation.color ? 'red' : 'gray'"
          :message="updateTaskStatusValidation.color"
          fullwidth
          with-label
          label-from-resource
          placeholder-from-resource
          :options="
            getAvaiableStatusColors().map((item) => ({
              id: item,
              name: capitalize(item),
            }))
          "
          v-model="form.color"
        />
      </div>

      <template #footer="{ close }">
        <div class="flex items-center justify-end gap-x-2">
          <base-button
            type="submit"
            color="indigo"
            text="actions.save"
            :loading="updateTaskStatusLoading"
            text-from-resource
          />
          <base-button
            text="actions.cancel"
            text-from-resource
            v-on:click="close"
          />
        </div>
      </template>
    </base-modal>
  </form>
</template>
